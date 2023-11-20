// Return formatted time
export default function (time: number) {
    const timeArray = new Date(time * 1000).toISOString().slice(11, 19).split(':');

    return {
        hours: timeArray[0],
        minutes: timeArray[1], 
        seconds: timeArray[2]
    }
}
