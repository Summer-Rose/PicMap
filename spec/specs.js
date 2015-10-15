describe('callImages', function() {
  it("callImages is a function", function() {
    expect(callImages).to.be.a('function');
  });

});

describe('deletePreviousMarker', function() {
  it("deletePreviousMarker is a function", function() {
    expect(deletePreviousMarker).to.be.a('function');
  });
});

describe('randomLatLng', function() {
  it("randomLatLng is a function", function() {
    expect(randomLatLng).to.be.a('function');
  });
  it("randomLatLng returns an array", function() {
    expect(randomLatLng()).to.be.an('array');
  });
});

describe('calculateDifference', function() {
  it("calculateDifference is a function", function() {
    expect(calculateDifference).to.be.a('function');
  });
});

describe('deg2rad', function() {
  it("deg2rad is a function", function() {
    expect(deg2rad).to.be.a('function');
  });
});

describe('addLine', function() {
  it("addLine is a function", function() {
    expect(addLine).to.be.a('function');
  });
});

describe('newGame', function() {
  it("newGame is a function", function() {
    expect(newGame).to.be.a('function');
  });
});
