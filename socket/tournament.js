const { app } = require("../loaders/app")
const { eventModel } = require("../models/events")

const shuffle = async (data) => {
    //Fetch tournament details
    //Fetch tournament
    const tournament = await eventModel.findOne({ eventid: "TR-4343434343" })
    const socket = app.get("socketIo")

    const tournamentId = tournament.eventid
    const array = tournament.users
    let arrayLen = array.length
    let kickedMember;
    if (arrayLen % 2 !== 0) {
        array.pop()
        kickedMember = array[arrayLen - 1]
        arrayLen--
    }

    const pairsArr = []

    for (let i = 0; i < arrayLen / 2; i++) {
        pairsArr.push([array[i], array[arrayLen - (i + 1)]])
    }

    const socketMembers = socket.of(`/${tournamentId}`).fetchSockets()

    for (const pairs of pairsArr) {
        const memberName1 = pairs[0]
        const memberName2 = pairs[1]
        const member1Client = await findMember(memberName1, tournamentId)
        const member2Client = await findMember(memberName2, tournamentId

        )

        if (member1Client && member2Client) {
            const roomName = memberName1
        }
    }

    console.log(pairsArr)
}

async function findMember(memberName, tournamentId) {
    const socket = app.get("socketIo")
    const socketMembers = await socket.of(`/${tournamentId}`).fetchSockets()
    for (const member of socketMembers) {
        const clientData = member.data
        if (data.userName === memberName) {
            return member
        }
    }

    return null
}

module.exports = { shuffle }