import asyncio
import datetime as dt
import math
from decimal import Decimal

from sqlalchemy import text

from app.db import SessionLocal, engine
from app.models import Budget, Category, CategoryType, Transaction, User
from app.security import hash_password

USERS = [
    ("demo@example.com", "Алексей К.", "demo12345", None),
    ("maria@example.com", "Мария С.", "maria12345", {"salary", "groceries", "cafe", "transport"}),
]

INCOME = CategoryType.INCOME
EXPENSE = CategoryType.EXPENSE

CATEGORIES = [
    ("salary", "Зарплата", INCOME, "#2e7d32", "salary"),
    ("freelance", "Фриланс", INCOME, "#00897b", "freelance"),
    ("cashback", "Кэшбэк и проценты", INCOME, "#7cb342", "cashback"),
    ("gifts", "Подарки", INCOME, "#c0ca33", "gift"),
    ("groceries", "Продукты", EXPENSE, "#ef6c00", "groceries"),
    ("cafe", "Кафе и рестораны", EXPENSE, "#d81b60", "cafe"),
    ("transport", "Транспорт", EXPENSE, "#1e88e5", "transport"),
    ("housing", "Жильё и ЖКУ", EXPENSE, "#6d4c41", "housing"),
    ("health", "Здоровье", EXPENSE, "#e53935", "health"),
    ("entertainment", "Развлечения", EXPENSE, "#8e24aa", "entertainment"),
    ("clothes", "Одежда", EXPENSE, "#3949ab", "clothes"),
    ("education", "Образование", EXPENSE, "#00acc1", "education"),
    ("communication", "Связь и интернет", EXPENSE, "#546e7a", "communication"),
]

BUDGETS = {
    "groceries": 17000,
    "cafe": 7000,
    "transport": 5000,
    "entertainment": 4000,
    "health": 5000,
    "education": 5000,
    "communication": 1000,
    "clothes": 6000,
}

MONTHS = [(2026, m) for m in range(4, 10)]
LAST_DATE = dt.date(2026, 9, 20)

TEMPLATES = [
    ("salary", 5, 95000, "Зарплата, аванс и расчёт", None),
    ("freelance", 18, 21000, "Заказ на вёрстку лендинга", {0, 2, 4, 5}),
    ("cashback", 28, 1300, "Кэшбэк по карте", None),
    ("gifts", 14, 10000, "Подарок на день рождения", {3}),
    ("housing", 3, 32000, "Аренда квартиры", None),
    ("housing", 12, 5400, "Коммунальные платежи", None),
    ("transport", 1, 2900, "Проездной на месяц", None),
    ("transport", 19, 720, "Такси", None),
    ("communication", 10, 890, "Мобильная связь и интернет", None),
    ("groceries", 2, 4800, "Супермаркет", None),
    ("groceries", 9, 5600, "Продукты на неделю", None),
    ("groceries", 16, 6100, "Супермаркет", None),
    ("groceries", 23, 4300, "Рынок", None),
    ("cafe", 7, 1850, "Обед с коллегами", None),
    ("cafe", 13, 3400, "Ужин в ресторане", None),
    ("cafe", 20, 2600, "Кофейня и доставка", {1, 3, 5}),
    ("entertainment", 15, 2400, "Кино и подписки", None),
    ("health", 11, 3200, "Аптека и анализы", {0, 2, 3, 5}),
    ("clothes", 17, 7900, "Кроссовки", {1, 4}),
    ("education", 8, 4500, "Онлайн-курс по TypeScript", {2, 5}),
]


def vary(amount: int, seed: int) -> int:
    factor = 1 + ((seed * 7919) % 17 - 8) / 100
    return math.floor(amount * factor / 10 + 0.5) * 10


def build_transactions(categories: dict[str, Category]) -> list[Transaction]:
    result = []
    for month_index, (year, month) in enumerate(MONTHS):
        templates = [
            t for t in TEMPLATES if t[0] in categories and (t[4] is None or month_index in t[4])
        ]
        for template_index, (key, day, amount, comment, _) in enumerate(templates):
            date = dt.date(year, month, day)
            if date > LAST_DATE:
                continue
            if key == "salary":
                value = amount + (7000 if month_index >= 3 else 0)
            else:
                value = vary(amount, month_index * 31 + template_index)
            result.append(
                Transaction(
                    category=categories[key],
                    amount=Decimal(value),
                    date=date,
                    comment=comment,
                )
            )
    return result


async def seed() -> None:
    async with SessionLocal() as session:
        await session.execute(
            text(
                "TRUNCATE transactions, budgets, categories, refresh_sessions, users "
                "RESTART IDENTITY CASCADE"
            )
        )

        summary = []
        for email, name, password, keys in USERS:
            user = User(email=email, name=name, password_hash=hash_password(password))
            session.add(user)
            await session.flush()

            categories = {
                key: Category(user_id=user.id, name=cname, type=type_, color=color, icon=icon)
                for key, cname, type_, color, icon in CATEGORIES
                if keys is None or key in keys
            }
            session.add_all(categories.values())
            await session.flush()
            budgets = [
                Budget(category_id=categories[key].id, limit=Decimal(limit))
                for key, limit in BUDGETS.items()
                if key in categories
            ]
            session.add_all(budgets)
            transactions = build_transactions(categories)
            session.add_all(transactions)
            summary.append(
                f"{email} / {password}: {len(categories)} categories, "
                f"{len(budgets)} budgets, {len(transactions)} transactions"
            )
        await session.commit()

    await engine.dispose()
    print("Seeded users:", *summary, sep="\n  ")


if __name__ == "__main__":
    asyncio.run(seed())
