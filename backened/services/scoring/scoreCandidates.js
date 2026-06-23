export function scoreCandidates(candidates){
    return candidates.map(candidate => {
        let score = 0;
        switch(candidate.type){
            case "comparison" : 
            score = 100;
            break;

             case "correlation" : 
            score = 90;
            break;

             case "trend" : 
            score = 80;
            break;

             case "distribution" : 
            score = 70;
            break;

            default : 
            score = 0
            
        }
            return { 
                ...candidate ,score
            }
        
    })
}