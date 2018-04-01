var pathCalculator = {
    
        /** @param {Creep} creep **/
        run: function(creep) 
        {

//console.log("screep: "+ creep.name + "room" + creep.pos.roomName );
        let goals =  Game.rooms['W63N28'].find(FIND_STRUCTURES, {
            filter: function(object)
            {
                return object.structureType == STRUCTURE_CONTROLLER;
            } 
        });    

//let goals = _.map(Game.rooms['W63N28'].find(STRUCTURE_CONTROLLER),function(control) {
    //        return {pos: control.pos,range: 1};
    //});
       console.log(goals);
        //)),(_.map(Game.rooms['W62N27'].controller.pos)),(_.map(Game.rooms['W63N27'].controller.pos))];
    if(creep.pos.roomName && creep.pos.x >= 0)
    {
        //console.log(creep.name);
        let ret = PathFinder.search(
            creep.pos, goals,
            {
            // We need to set the defaults costs higher so that we
            // can set the road cost lower in `roomCallback`
            plainCost: 2,
            swampCost: 10,

            roomCallback: function(roomName) {

                let room = Game.rooms[roomName];
                // In this example `room` will always exist, but since 
                // PathFinder supports searches which span multiple rooms 
                // you should be careful!
                if (!room) return;
                let costs = new PathFinder.CostMatrix;

                room.find(FIND_STRUCTURES).forEach(function(struct) {
                if (struct.structureType === STRUCTURE_ROAD) {
                    // Favor roads over plain tiles
                    costs.set(struct.pos.x, struct.pos.y, 1);
                } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)) {
                    // Can't walk through non-walkable buildings
                    costs.set(struct.pos.x, struct.pos.y, 0xff);
                }
                });

                // Avoid creeps in the room
                room.find(FIND_CREEPS).forEach(function(creep) {
                costs.set(creep.pos.x, creep.pos.y, 0xff);
                });

                return costs;
            },
            }
        );

        let pos = ret.path[0];
        //console.log(ret.path);
        creep.memory.Savedpath = ret.path;
        // creep.move(creep.pos.getDirectionTo(pos));
    }
}
};

module.exports = pathCalculator;