export default function getEmptySequence(tableau: string[][], len: number) {
  const resultats = []
  let debutSuite = -1
  let longueurSuite = 0
  for (let i = 0; i < tableau.length; i++) {
    const sousTableau = tableau[i]
    if (sousTableau.length === 0) {
      if (debutSuite === -1)
      { debutSuite = i }

      longueurSuite++
    }
    else {
      if (debutSuite !== -1) {
        resultats.push({ start: debutSuite, length: longueurSuite >= len ? len : longueurSuite })
        debutSuite = -1
        longueurSuite = 0
      }
    }
  }

  if (debutSuite !== -1) {
    resultats.push({ start: debutSuite, length: longueurSuite >= len ? len : longueurSuite })
  }

  return resultats
}