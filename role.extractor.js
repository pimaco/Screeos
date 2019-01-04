var roleExtractor = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        var mine = creep.room.find(FIND_MINERALS)[0];
        var total = _.sum(creep.carry);
        if(mine && total < creep.carryCapacity && creep.harvest(mine) != ERR_NOT_ENOUGH_RESOURCES) 
        {
            //console.log('Hydrogen');
            creep.pos.findInRange(FIND_DROPPED_RESOURCES).forEach(function(res) {
            //var creep = res.findClosestCarrier();
            creep.pickup(res);
            });
            
            
            if(creep.harvest(mine) == ERR_NOT_IN_RANGE) 
            {
                creep.travelTo(mine);
            }
        }
        else if(creep.room.terminal && _.sum(creep.room.terminal.store) < 275000)
        {
            if(creep.transfer(creep.room.terminal, _.findKey(creep.carry)) == ERR_NOT_IN_RANGE) 
            {
                creep.travelTo(creep.room.terminal);  
                creep.transfer(creep.room.terminal, _.findKey(creep.carry));
            }
        }
    }	
};

module.exports = roleExtractor;