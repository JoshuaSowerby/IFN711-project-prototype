export const FormatScore = (value)=>{
    //only show maximum of 3 digits + decimal
    //integer=Math.round(value);
    //decimal=value-integer;
    return Math.round(value*100)/100//value.toString().slice(0,2)
}