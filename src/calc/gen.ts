function genNode(){
    var left=1,right=2,op="*"
    return {"left":left,"right":right,"op":op};
}

function gen(...args: number[]) {
    return genNode()+"";
}

export default gen