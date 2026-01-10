export const SELECTORS = {
  ingredientsSection: 'section', 
  ingredientCard: 'a, li, div',
  ingredientButton: 'button',
  
  constructor: '[class*="burger-constructor"], [class*="constructor"], section:has(> div)',
  
  modal: '.modal, [class*="modal"], [role="dialog"]',
  
  modalClose: '[class*="close"], button[aria-label*="close"]'
};

export const INGREDIENTS = {
  bun: 'Флюоресцентная булка R2-D3',
  main: 'Биокотлета из марсианской Магнолии'
};