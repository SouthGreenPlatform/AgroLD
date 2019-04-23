function Coname(name, isPreferred) {
    //JSONifiable.call(this);
    this.name = name;
    this.isPreferred = isPreferred;
}

var coname1 = new Coname("touriste", "true");
var coname2 = new Coname("agent", "false");

function Concept(id, annotation) {
    this.id = id;
    this.annotation = annotation;
    this.conames = [];

    this.addConame = function (coname) {
        this.conames.push(coname);
    };
}
var concept1 = new Concept("1", "");
concept1.addConame(coname1);
concept1.addConame(coname2);
console.log(JSON.stringify(concept1));