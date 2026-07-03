import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import './styles/main.scss'

export const createRoot = ViteReactSSG({ routes })
