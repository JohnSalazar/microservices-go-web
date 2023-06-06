import { HeaderManager } from './HeaderManager'

export interface LayoutProps {
  children: React.ReactNode
}

export default function LayoutManager({ children }: LayoutProps) {
  return (
    <>
      <HeaderManager />
      {children}
    </>
  )
}
