import type { SvgIconComponent } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined'
import DirectionsBusOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined'
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import type { Category, CategoryIconKey } from './model'

const icons: Record<CategoryIconKey, SvgIconComponent> = {
  salary: WorkOutlineOutlinedIcon,
  freelance: LaptopMacOutlinedIcon,
  cashback: PercentOutlinedIcon,
  gift: CardGiftcardOutlinedIcon,
  groceries: ShoppingCartOutlinedIcon,
  cafe: RestaurantOutlinedIcon,
  transport: DirectionsBusOutlinedIcon,
  housing: HomeOutlinedIcon,
  health: LocalHospitalOutlinedIcon,
  entertainment: SportsEsportsOutlinedIcon,
  clothes: CheckroomOutlinedIcon,
  education: SchoolOutlinedIcon,
  communication: PhoneAndroidOutlinedIcon,
}

type CategoryAvatarProps = {
  category: Category
  size?: number
}

export function CategoryAvatar({ category, size = 40 }: CategoryAvatarProps) {
  const Icon = icons[category.icon]
  return (
    <Avatar sx={{ width: size, height: size, bgcolor: category.color }}>
      <Icon sx={{ fontSize: size * 0.55 }} />
    </Avatar>
  )
}
