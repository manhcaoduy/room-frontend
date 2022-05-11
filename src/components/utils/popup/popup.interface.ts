export interface IndexProp {
  isOpen: boolean;
  setIsOpen: any;
  handleEnable: (price: number) => Promise<void>;
}
