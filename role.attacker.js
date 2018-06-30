module.exports = function (creep) {
    
    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: function (i) { return i.owner.username != 'porkradish' } });
    
    if(target) 
    {
        //console.log('hostile detected: ' + target);
        if(creep.attack(target) == ERR_NOT_IN_RANGE) 
        {
            creep.travelTo(target);
        }
    }
    else
    {

        
        if(creep.pos.roomName != Game.flags.TOATTACK.pos.roomName)
        {
           // console.log(exit);
           creep.travelTo(Game.flags.TOATTACK);  
        }
        else
        {
            /*var targetSpawn =creep.room.find(FIND_HOSTILE_SPAWNS);
            if(targetSpawn.length)
            {
                if(creep.attack(targetSpawn [0]) == ERR_NOT_IN_RANGE)
                {
                    creep.travelTo(targetSpawn[0]);
                }
            }*/
            //else
           // {
                var hostileStruc =creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: function(object)
                    {
                        return object.structureType != STRUCTURE_CONTROLLER;
                    } 
                });
                
                if(hostileStruc)
                {
                    //console.log(hostileStruc.structureType);
                    if(creep.attack(hostileStruc) == ERR_NOT_IN_RANGE )
                    {
                        creep.travelTo(hostileStruc);
                        creep.attack(hostileStruc);
                    }
                    creep.attack(hostileStruc);
                }
                else
                {
                    creep.travelTo(Game.flags.TOATTACK); 
                }
           // }
        }
        
    }

};