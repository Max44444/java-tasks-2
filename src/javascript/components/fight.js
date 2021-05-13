import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {

    const firstFighterState = createFighterState(firstFighter, 'left');
    const secondFighterState = createFighterState(secondFighter, 'right');

    handleAttackActions(firstFighterState, secondFighterState, resolve);
    handleCriticalAttack(firstFighterState, secondFighterState, resolve);
    handleBlockActions(firstFighterState, secondFighterState);

  });
}

function createFighterState(fighter, position) {
  return {
    fighter,
    indicator: document.getElementById(`${position}-fighter-indicator`),
    health: fighter.health,
    isBlock: false,
    canCriticallyAttack: false
  }
}

function handleAttackActions(firstFighterState, secondFighterState, resolve) {

  const attack = (attackerState, defenderState) => {
    if (!attackerState.isBlock && !defenderState.isBlock) {
      if (attackAction(attackerState, defenderState, getDamage) === 'win') {
        resolve(attackerState.fighter)
      }
    }
  }

  document.addEventListener('keydown', event => {

    switch (event.code) {
      case controls.PlayerOneAttack:
        attack(firstFighterState, secondFighterState);
        break;

      case controls.PlayerTwoAttack:
        attack(secondFighterState, firstFighterState)
        break;
    }

  });
}

function handleBlockActions(firstFighterState, secondFighterState) {

  document.addEventListener('keydown', event => {
    switch (event.code) {
      case controls.PlayerOneBlock:
        firstFighterState.isBlock = true;
        break;

      case controls.PlayerTwoBlock:
        secondFighterState.isBlock = true;
        break;
    }
  })

  document.addEventListener('keyup', event => {
    switch (event.code) {
      case controls.PlayerOneBlock:
        firstFighterState.isBlock = false;
        break;

      case controls.PlayerTwoBlock:
        secondFighterState.isBlock = false;
        break;
    }
  });

}

function handleCriticalAttack(firstFighterState, secondFighterState, resolve) {

  const pressedKeys = new Set();

  const isCombinationPresent = combination => combination.every(key => pressedKeys.has(key));

  const resetCriticalAttackTimer = attackerState => {
    attackerState.canCriticallyAttack = false;
    setTimeout(() => attackerState.canCriticallyAttack = true, 10000);
  }

  const tryAttack = (attackerState, defenderState, combination) => {
    if (!attackerState.isBlock && attackerState.canCriticallyAttack && isCombinationPresent(combination)) {
      resetCriticalAttackTimer(attackerState);
      pressedKeys.clear();
      if (attackAction(attackerState, defenderState, getCriticalDamage) === 'win') {
        resolve(attackerState.fighter)
      }
    }
  }

  const keyDownHandler = event => {
    pressedKeys.add(event.code)
    tryAttack(firstFighterState, secondFighterState, controls.PlayerOneCriticalHitCombination);
    tryAttack(secondFighterState, firstFighterState, controls.PlayerTwoCriticalHitCombination);
  }

  resetCriticalAttackTimer(firstFighterState);
  resetCriticalAttackTimer(secondFighterState);

  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', event => pressedKeys.delete(event.code));

}

function attackAction(attackerState, defenderState, calcDamage) {
  const { fighter: attacker } = attackerState;
  const { fighter: defender } = defenderState;

  const damage = calcDamage(attacker, defender);
  const possibleDamage = Math.min(defenderState.health, damage);
  defenderState.health -= possibleDamage;
  defenderState.indicator.style.width = `${100 / defender.health * defenderState.health}%`;

  return defenderState.health === 0 ? 'win' : 'blocked';
}

function getCriticalDamage(attacker, defender) {
  return getDamage({
    attacker,
    attack: attacker.attack * 2
  }, defender);
}

export function getDamage(attacker, defender) {
  const hitPower = getHitPower(attacker);
  const blockPower = getBlockPower(defender)
  return Math.max(0, hitPower - blockPower);
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  return fighter.defense * dodgeChance;
}
