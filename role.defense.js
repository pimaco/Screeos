module.exports = function (creep) {
    
    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
   // var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: function (i) { return i.owner.username != 'porkradish' } });
    //console.log(Memory.myrooms[0].name);
    if(target) 
    {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) 
        {
            creep.travelTo(target);
        }
    }
    else
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.travelTo(Game.rooms[creep.memory.home.name].controller);
        }
        else
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
           // var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: function (i) { return i.owner.username != 'porkradish' } });            
            //console.log(Memory.myrooms[0].name);
            if(target) 
            {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) 
                {
                    creep.travelTo(target);
                }
            }
        }
    }

};