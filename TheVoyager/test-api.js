import handler from './api/generate-plan.js';

const req = {
  method: 'POST',
  body: {
    location: "Goa",
    days: 3,
    people: 2,
    profile: "couple",
    budget: 20000
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log(`\n--- API RESPONSE (Status: ${this.statusCode}) ---`);
    console.dir(data, { depth: null, colors: true });
    console.log(`-------------------------------------------\n`);
  }
};

async function test() {
  console.log("Testing generate-plan.js with input:");
  console.dir(req.body, { colors: true });
  console.log("Waiting for OpenAI response...");
  await handler(req, res);
}

test();
