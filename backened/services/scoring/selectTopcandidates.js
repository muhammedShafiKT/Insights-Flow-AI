export function selectTopcandidates(scoredCandidates,limit=8){
  const selected = []
 const groups = {
  comparison : [],
  distribution : [],
  correlation : [],
  trend :[]
 }

 for(const candidate of scoredCandidates){
  if(groups[candidate.type]){
    groups[candidate.type].push(candidate)
  }
 }

 for(const group of Object.values(groups)){
group.sort((a,b)=>b.score-a.score)
 }
let quota = Math.floor(limit/4)


 for(const group of Object.values(groups)){
  for(let i =0;i<quota&&group.length>0&&selected.length<limit;i++){
selected.push(group.shift())
  }
 }
  const remaining = Object.values(groups).flat().sort((a,b)=>b.score-a.score)

  while(selected.length<limit&&remaining.length>0){
    selected.push(remaining.shift())
  }
 return selected
}