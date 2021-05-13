import { showModal } from './modal'
import { createElement } from '../../helpers/domHelper';

export function showWinnerModal(fighter) {
  const title = 'WINNER';
  const bodyElement = createElement({
    tagName: 'div',
    className: 'modal-body'
  });

  const img = createElement({
    tagName: 'img',
    attributes: { src: fighter.source }
  })

  const text = createElement({
    tagName: 'p'
  });
  text.textContent = fighter.name;

  bodyElement.append(img, text);

  showModal({
    title,
    bodyElement,
    onClose: () => {
      window.location.reload();
    }
  })
}
