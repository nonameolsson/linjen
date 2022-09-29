export interface HeaderProps {
  goBackTo?: string

  showBackButton: boolean

  opened: boolean

  rightButtons?: JSX.Element

  setOpened: (open: boolean) => void

  /**
   * Overrides title on mobile. This allows displaying currently selected screen title.
   */
  mobileTitle: string

  /**
   * Will be displayed on desktop.
   *
   * Defaults to `Linjen`.
   */
  desktopTitle?: string
}
