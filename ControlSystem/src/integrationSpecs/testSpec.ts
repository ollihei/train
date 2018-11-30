import app from "../app"
import { TrainSpecification, NetworkPart, Train } from "../interfaces/trainSpecification"
import { NetworkStatic } from "../logic/networkStatic";

var fileSystem = require('fs');

describe("Test TrainControlSystem", () => {

  beforeAll((done) => {
    const PORT = 3000;

    app.listen(PORT, () => {
      console.log('Express server listening on port ' + PORT);
      done();
    })
  });

  it("by first reding the data", () => {
    // const contents = fileSystem.readFileSync('../../tracks.json', 'utf8');
    const content = fileSystem.readFileSync('tracks.json', 'utf8');
     console.log(content);
    //console.log('after calling readFile');
    const trainSpecification: TrainSpecification = JSON.parse(content);
    const networkStatic: NetworkStatic = new NetworkStatic(trainSpecification);

    expect(networkStatic.getSwitches().length).toBe(2);


  }, 5000);
});
