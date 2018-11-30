"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const networkStatic_1 = require("../logic/networkStatic");
var fileSystem = require('fs');
describe("Test TrainControlSystem", () => {
    beforeAll((done) => {
        const PORT = 3000;
        app_1.default.listen(PORT, () => {
            console.log('Express server listening on port ' + PORT);
            done();
        });
    });
    it("by first reding the data", () => {
        // const contents = fileSystem.readFileSync('../../tracks.json', 'utf8');
        const content = fileSystem.readFileSync('tracks.json', 'utf8');
        console.log(content);
        //console.log('after calling readFile');
        const trainSpecification = JSON.parse(content);
        const networkStatic = new networkStatic_1.NetworkStatic(trainSpecification);
        expect(networkStatic.getSwitches().length).toBe(2);
    }, 5000);
});
//# sourceMappingURL=testSpec.js.map