// React Icons imports - Curated popular icons
import {
  // Material Design Icons
  MdHome, MdPerson, MdSettings, MdEmail, MdPhone, MdCamera, MdMusicNote,
  MdFavorite, MdStar, MdSearch, MdMenu, MdClose, MdAdd, MdRemove,
  MdCheck, MdEdit, MdDelete, MdDownload, MdUpload, MdShoppingCart,
  MdWork, MdSchool, MdLocationOn, MdNotifications, MdVisibility,
} from 'react-icons/md';

import {
  // Font Awesome Icons
  FaUser, FaHeart, FaStar, FaHome, FaEnvelope, FaPhone, FaCamera,
  FaMusic, FaSearch, FaCog, FaShoppingCart, FaCar, FaPlane,
  FaGithub, FaTwitter, FaFacebook, FaInstagram, FaLinkedin,
  FaApple, FaGoogle, FaMicrosoft, FaCode, FaLaptop, FaMobile,
  FaCoffee, FaUtensils, FaDog, FaCat, FaSun, FaMoon, FaCloud,
  FaFire, FaBolt, FaGem, FaCrown, FaLock, FaGamepad,
} from 'react-icons/fa';

import {
  // Heroicons
  HiHome, HiUser, HiCog, HiMail, HiPhone, HiCamera, HiMusicNote,
  HiHeart, HiStar, HiSearch, HiPlus, HiMinus, HiCheck,
  HiPencil, HiTrash, HiDownload, HiUpload, HiShoppingCart,
} from 'react-icons/hi';

import {
  // Bootstrap Icons
  BsHouse, BsPerson, BsGear, BsEnvelope, BsTelephone, BsCamera,
  BsHeart, BsStar, BsSearch, BsPlus, BsDash, BsCheck,
  BsPencil, BsTrash, BsDownload, BsUpload, BsCart,
} from 'react-icons/bs';

import {
  // Feather Icons
  FiHome, FiUser, FiSettings, FiMail, FiPhone, FiCamera,
  FiMusic, FiHeart, FiStar, FiSearch, FiPlus, FiMinus,
  FiCheck, FiEdit, FiTrash2, FiDownload, FiUpload,
} from 'react-icons/fi';

// Comprehensive icon database with search functionality
export const ICON_DATABASE = [
  // Navigation & Interface
  { icon: MdHome, name: 'Home', category: 'navigation', keywords: ['house', 'main', 'dashboard'] },
  { icon: FaHome, name: 'Home Alt', category: 'navigation', keywords: ['house', 'main', 'dashboard'] },
  { icon: HiHome, name: 'Home Heroicon', category: 'navigation', keywords: ['house', 'main', 'dashboard'] },
  { icon: BsHouse, name: 'House', category: 'navigation', keywords: ['home', 'main', 'building'] },
  { icon: FiHome, name: 'Home Feather', category: 'navigation', keywords: ['house', 'main', 'dashboard'] },
  
  { icon: MdMenu, name: 'Menu', category: 'navigation', keywords: ['hamburger', 'bars', 'navigation'] },
  { icon: MdSearch, name: 'Search', category: 'navigation', keywords: ['find', 'look', 'magnify'] },
  { icon: FaSearch, name: 'Search FA', category: 'navigation', keywords: ['find', 'look', 'magnify'] },
  { icon: HiSearch, name: 'Search Heroicon', category: 'navigation', keywords: ['find', 'look', 'magnify'] },
  { icon: BsSearch, name: 'Search Bootstrap', category: 'navigation', keywords: ['find', 'look', 'magnify'] },
  { icon: FiSearch, name: 'Search Feather', category: 'navigation', keywords: ['find', 'look', 'magnify'] },

  // People & Users
  { icon: MdPerson, name: 'Person', category: 'people', keywords: ['user', 'profile', 'account'] },
  { icon: FaUser, name: 'User', category: 'people', keywords: ['person', 'profile', 'account'] },
  { icon: HiUser, name: 'User Heroicon', category: 'people', keywords: ['person', 'profile', 'account'] },
  { icon: BsPerson, name: 'Person Bootstrap', category: 'people', keywords: ['user', 'profile', 'account'] },
  { icon: FiUser, name: 'User Feather', category: 'people', keywords: ['person', 'profile', 'account'] },

  // Communication
  { icon: MdEmail, name: 'Email', category: 'communication', keywords: ['mail', 'message', 'letter'] },
  { icon: FaEnvelope, name: 'Envelope', category: 'communication', keywords: ['email', 'mail', 'message'] },
  { icon: HiMail, name: 'Mail Heroicon', category: 'communication', keywords: ['email', 'message', 'letter'] },
  { icon: BsEnvelope, name: 'Envelope Bootstrap', category: 'communication', keywords: ['email', 'mail', 'message'] },
  { icon: FiMail, name: 'Mail Feather', category: 'communication', keywords: ['email', 'message', 'letter'] },
  
  { icon: MdPhone, name: 'Phone', category: 'communication', keywords: ['call', 'telephone', 'mobile'] },
  { icon: FaPhone, name: 'Phone FA', category: 'communication', keywords: ['call', 'telephone', 'mobile'] },
  { icon: HiPhone, name: 'Phone Heroicon', category: 'communication', keywords: ['call', 'telephone', 'mobile'] },
  { icon: BsTelephone, name: 'Telephone', category: 'communication', keywords: ['phone', 'call', 'mobile'] },
  { icon: FiPhone, name: 'Phone Feather', category: 'communication', keywords: ['call', 'telephone', 'mobile'] },

  // Emotions & Social
  { icon: MdFavorite, name: 'Favorite', category: 'emotion', keywords: ['heart', 'love', 'like'] },
  { icon: FaHeart, name: 'Heart', category: 'emotion', keywords: ['love', 'favorite', 'like'] },
  { icon: HiHeart, name: 'Heart Heroicon', category: 'emotion', keywords: ['love', 'favorite', 'like'] },
  { icon: BsHeart, name: 'Heart Bootstrap', category: 'emotion', keywords: ['love', 'favorite', 'like'] },
  { icon: FiHeart, name: 'Heart Feather', category: 'emotion', keywords: ['love', 'favorite', 'like'] },
  
  { icon: MdStar, name: 'Star', category: 'emotion', keywords: ['rating', 'favorite', 'bookmark'] },
  { icon: FaStar, name: 'Star FA', category: 'emotion', keywords: ['rating', 'favorite', 'bookmark'] },
  { icon: HiStar, name: 'Star Heroicon', category: 'emotion', keywords: ['rating', 'favorite', 'bookmark'] },
  { icon: BsStar, name: 'Star Bootstrap', category: 'emotion', keywords: ['rating', 'favorite', 'bookmark'] },
  { icon: FiStar, name: 'Star Feather', category: 'emotion', keywords: ['rating', 'favorite', 'bookmark'] },

  // Media & Entertainment
  { icon: MdCamera, name: 'Camera', category: 'media', keywords: ['photo', 'picture', 'image'] },
  { icon: FaCamera, name: 'Camera FA', category: 'media', keywords: ['photo', 'picture', 'image'] },
  { icon: HiCamera, name: 'Camera Heroicon', category: 'media', keywords: ['photo', 'picture', 'image'] },
  { icon: BsCamera, name: 'Camera Bootstrap', category: 'media', keywords: ['photo', 'picture', 'image'] },
  { icon: FiCamera, name: 'Camera Feather', category: 'media', keywords: ['photo', 'picture', 'image'] },
  
  { icon: MdMusicNote, name: 'Music Note', category: 'media', keywords: ['sound', 'audio', 'song'] },
  { icon: FaMusic, name: 'Music', category: 'media', keywords: ['sound', 'audio', 'song'] },
  { icon: HiMusicNote, name: 'Music Note Heroicon', category: 'media', keywords: ['sound', 'audio', 'song'] },
  { icon: FiMusic, name: 'Music Feather', category: 'media', keywords: ['sound', 'audio', 'song'] },
  { icon: FaGamepad, name: 'Gamepad', category: 'media', keywords: ['game', 'controller', 'play'] },

  // Settings & Controls
  { icon: MdSettings, name: 'Settings', category: 'controls', keywords: ['gear', 'config', 'preferences'] },
  { icon: FaCog, name: 'Cog', category: 'controls', keywords: ['settings', 'gear', 'config'] },
  { icon: HiCog, name: 'Cog Heroicon', category: 'controls', keywords: ['settings', 'gear', 'config'] },
  { icon: BsGear, name: 'Gear', category: 'controls', keywords: ['settings', 'cog', 'config'] },
  { icon: FiSettings, name: 'Settings Feather', category: 'controls', keywords: ['gear', 'config', 'preferences'] },

  // Actions
  { icon: MdAdd, name: 'Add', category: 'actions', keywords: ['plus', 'create', 'new'] },
  { icon: HiPlus, name: 'Plus', category: 'actions', keywords: ['add', 'create', 'new'] },
  { icon: BsPlus, name: 'Plus Bootstrap', category: 'actions', keywords: ['add', 'create', 'new'] },
  { icon: FiPlus, name: 'Plus Feather', category: 'actions', keywords: ['add', 'create', 'new'] },
  
  { icon: MdRemove, name: 'Remove', category: 'actions', keywords: ['minus', 'delete', 'subtract'] },
  { icon: HiMinus, name: 'Minus', category: 'actions', keywords: ['remove', 'delete', 'subtract'] },
  { icon: BsDash, name: 'Dash', category: 'actions', keywords: ['minus', 'remove', 'subtract'] },
  { icon: FiMinus, name: 'Minus Feather', category: 'actions', keywords: ['remove', 'delete', 'subtract'] },
  
  { icon: MdCheck, name: 'Check', category: 'actions', keywords: ['tick', 'done', 'complete'] },
  { icon: HiCheck, name: 'Check Heroicon', category: 'actions', keywords: ['tick', 'done', 'complete'] },
  { icon: BsCheck, name: 'Check Bootstrap', category: 'actions', keywords: ['tick', 'done', 'complete'] },
  { icon: FiCheck, name: 'Check Feather', category: 'actions', keywords: ['tick', 'done', 'complete'] },
  
  { icon: MdEdit, name: 'Edit', category: 'actions', keywords: ['pencil', 'modify', 'write'] },
  { icon: HiPencil, name: 'Pencil', category: 'actions', keywords: ['edit', 'modify', 'write'] },
  { icon: BsPencil, name: 'Pencil Bootstrap', category: 'actions', keywords: ['edit', 'modify', 'write'] },
  { icon: FiEdit, name: 'Edit Feather', category: 'actions', keywords: ['pencil', 'modify', 'write'] },
  
  { icon: MdDelete, name: 'Delete', category: 'actions', keywords: ['trash', 'remove', 'bin'] },
  { icon: HiTrash, name: 'Trash', category: 'actions', keywords: ['delete', 'remove', 'bin'] },
  { icon: BsTrash, name: 'Trash Bootstrap', category: 'actions', keywords: ['delete', 'remove', 'bin'] },
  { icon: FiTrash2, name: 'Trash Feather', category: 'actions', keywords: ['delete', 'remove', 'bin'] },
  
  { icon: MdDownload, name: 'Download', category: 'actions', keywords: ['save', 'export', 'get'] },
  { icon: HiDownload, name: 'Download Heroicon', category: 'actions', keywords: ['save', 'export', 'get'] },
  { icon: BsDownload, name: 'Download Bootstrap', category: 'actions', keywords: ['save', 'export', 'get'] },
  { icon: FiDownload, name: 'Download Feather', category: 'actions', keywords: ['save', 'export', 'get'] },
  
  { icon: MdUpload, name: 'Upload', category: 'actions', keywords: ['send', 'import', 'put'] },
  { icon: HiUpload, name: 'Upload Heroicon', category: 'actions', keywords: ['send', 'import', 'put'] },
  { icon: BsUpload, name: 'Upload Bootstrap', category: 'actions', keywords: ['send', 'import', 'put'] },
  { icon: FiUpload, name: 'Upload Feather', category: 'actions', keywords: ['send', 'import', 'put'] },

  // Brands & Technology
  { icon: FaApple, name: 'Apple', category: 'brands', keywords: ['company', 'tech', 'fruit'] },
  { icon: FaGoogle, name: 'Google', category: 'brands', keywords: ['search', 'company', 'tech'] },
  { icon: FaMicrosoft, name: 'Microsoft', category: 'brands', keywords: ['company', 'tech', 'windows'] },
  { icon: FaGithub, name: 'GitHub', category: 'brands', keywords: ['code', 'repository', 'development'] },
  { icon: FaTwitter, name: 'Twitter', category: 'brands', keywords: ['social', 'bird', 'tweet'] },
  { icon: FaFacebook, name: 'Facebook', category: 'brands', keywords: ['social', 'network', 'meta'] },
  { icon: FaInstagram, name: 'Instagram', category: 'brands', keywords: ['social', 'photo', 'camera'] },
  { icon: FaLinkedin, name: 'LinkedIn', category: 'brands', keywords: ['professional', 'network', 'job'] },
  
  { icon: FaCode, name: 'Code', category: 'technology', keywords: ['programming', 'development', 'script'] },
  { icon: FaLaptop, name: 'Laptop', category: 'technology', keywords: ['computer', 'device', 'portable'] },
  { icon: FaMobile, name: 'Mobile', category: 'technology', keywords: ['phone', 'device', 'smartphone'] },

  // Business & Shopping
  { icon: MdWork, name: 'Work', category: 'business', keywords: ['job', 'briefcase', 'office'] },
  { icon: MdShoppingCart, name: 'Shopping Cart', category: 'business', keywords: ['cart', 'shop', 'buy'] },
  { icon: FaShoppingCart, name: 'Shopping Cart FA', category: 'business', keywords: ['cart', 'shop', 'buy'] },
  { icon: HiShoppingCart, name: 'Shopping Cart Heroicon', category: 'business', keywords: ['cart', 'shop', 'buy'] },
  { icon: BsCart, name: 'Cart', category: 'business', keywords: ['shopping', 'shop', 'buy'] },

  // Transport
  { icon: FaCar, name: 'Car', category: 'transport', keywords: ['vehicle', 'auto', 'drive'] },
  { icon: FaPlane, name: 'Plane', category: 'transport', keywords: ['airplane', 'flight', 'travel'] },

  // Nature & Weather
  { icon: FaSun, name: 'Sun', category: 'nature', keywords: ['weather', 'sunny', 'day'] },
  { icon: FaMoon, name: 'Moon', category: 'nature', keywords: ['night', 'dark', 'lunar'] },
  { icon: FaCloud, name: 'Cloud', category: 'nature', keywords: ['weather', 'sky', 'storage'] },
  { icon: FaFire, name: 'Fire', category: 'nature', keywords: ['flame', 'hot', 'burn'] },
  { icon: FaBolt, name: 'Bolt', category: 'nature', keywords: ['lightning', 'electric', 'fast'] },

  // Food & Animals
  { icon: FaCoffee, name: 'Coffee', category: 'food', keywords: ['drink', 'caffeine', 'cup'] },
  { icon: FaUtensils, name: 'Food', category: 'food', keywords: ['food', 'eat', 'utensils'] },
  { icon: FaDog, name: 'Dog', category: 'animals', keywords: ['pet', 'puppy', 'animal'] },
  { icon: FaCat, name: 'Cat', category: 'animals', keywords: ['pet', 'kitten', 'animal'] },

  // Special
  { icon: FaGem, name: 'Gem', category: 'special', keywords: ['diamond', 'precious', 'valuable'] },
  { icon: FaCrown, name: 'Crown', category: 'special', keywords: ['king', 'royal', 'premium'] },
  { icon: FaLock, name: 'Lock', category: 'special', keywords: ['protection', 'security', 'safe'] },

  // Location & Notifications
  { icon: MdLocationOn, name: 'Location', category: 'general', keywords: ['place', 'map', 'pin'] },
  { icon: MdNotifications, name: 'Notifications', category: 'general', keywords: ['bell', 'alert', 'message'] },
  { icon: MdVisibility, name: 'Visibility', category: 'general', keywords: ['eye', 'see', 'view'] },
  { icon: MdSchool, name: 'School', category: 'general', keywords: ['education', 'learning', 'study'] },
];

// Icon categories for filtering
export const ICON_CATEGORIES = [
  'all',
  'navigation',
  'people',
  'communication',
  'emotion',
  'media',
  'controls',
  'actions',
  'brands',
  'technology',
  'business',
  'transport',
  'nature',
  'food',
  'animals',
  'special',
  'general',
];

// Predefined color palettes
export const COLOR_PALETTES = [
  { name: 'Default', colors: ['#000000', '#FFD700', '#FF69B4', '#00FF7F', '#1E90FF'] },
  { name: 'Vibrant', colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2'] },
  { name: 'Pastel', colors: ['#F8BBD9', '#F1C0E8', '#CFBAF0', '#A3C4F3', '#90DBF4'] },
];