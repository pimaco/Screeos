module.exports = function (creep) {
    
   // var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: function (i) { return i.owner.username != 'porkradish' } });
    //console.log(Memory.myrooms[0].name);
    if(target) 
    {
        if(creep.attack(target) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(target);
        }
    }
    else
    {
        if(creep.pos.roomName != creep.memory.home.name)
        {
            creep.moveTo(Game.rooms[creep.memory.home.name].controller);
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
                    creep.moveTo(target);
                }
            }
            else
            {
                if(creep.memory.home.name == Memory.myrooms[0].name)
                {
                    creep.moveTo(Game.flags.Flag1);
                }
                else if (creep.memory.home.name == Memory.myrooms[1].name)
                {
                    creep.moveTo(Game.flags.Flag2);
                }
                else if (creep.memory.home.name == Memory.myrooms[2].name)
                {
                    creep.moveTo(Game.flags.Flag3);
                }
            }
        }
    }

};