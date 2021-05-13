import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (fighter) {
    const img = createElement({
      tagName: 'img',
      attributes: { src: fighter.source }
    });

    const name = createElement({ tagName: 'h3' });
    name.textContent = fighter.name.toUpperCase();

    fighterElement.append(img, name);

    ['health', 'attack', 'defense'].forEach(key => {
      const element = createElement({
        tagName: 'p'
      });
      element.textContent = `${key}: ${fighter[key]}`;

      fighterElement.append(element);
    })

  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };

  return createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });
}
