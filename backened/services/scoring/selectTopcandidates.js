export function selectTopcandidates(scoredCandidates,limit=8){
  return  scoredCandidates.sort((a,b)=>b.score-a.score).slice(0,limit)
}