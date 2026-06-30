import type { RouteRecord } from 'vite-react-ssg'
import Layout from './components/Layout'
import Home from './pages/home'
import LegalNotice from './pages/aviso-legal'

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: Layout,
    entry: 'src/components/Layout.tsx',
    children: [
      { index: true, Component: Home, entry: 'src/pages/home.tsx' },
      { path: 'aviso-legal', Component: LegalNotice, entry: 'src/pages/aviso-legal.tsx' },
    ],
  },
]
