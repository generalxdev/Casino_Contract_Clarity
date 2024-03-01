import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
import { exec } from "child_process";
describe("casino contract test suite", () => {
  let casinoClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    casinoClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.casino", "casino", provider);
  });
  it("should have a valid syntax", async () => {
    await casinoClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const getCasino = async () => {
      const query = casinoClient.createQuery({
        method: { name: "get-casino", args: [] }
      });
      const receipt = await casinoClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }
      
    const getPlayerNumber = async () => {
      const query = casinoClient.createQuery({
        method: { name: "get-player-number", args: [] }
      });
      const receipt = await casinoClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const getBet = async () => {
      const query = casinoClient.createQuery({
        method: { name: "get-player-bet", args: [] }
      });
      const receipt = await casinoClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const getNumberWin = async () => {
      const query = casinoClient.createQuery({
        method: { name: "get-number-win", args: [] }
      });
      const receipt = await casinoClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const checkOdd = async () => {
      const query = casinoClient.createQuery({
        method: { name: "check-casino-odd", args: [] }
      });
      const receipt = await casinoClient.submitQuery(query);
      const result = Result.unwrap(receipt); //unwraping bool
      return result;
    }

    const checkOddWin = async () => {
      const query = casinoClient.createQuery({
        method: { name: "get-odd-win", args: [] }
      });
      const receipt = await casinoClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }

    const execMethod = async (method: string) => {
      const tx = casinoClient.createTransaction({
        method: {
          name: method,
          args: [],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await casinoClient.submitTransaction(tx);
      return receipt;
    }

    before(async () => {
      await casinoClient.deployContract();
    });
    
    it("Bet size ", async () =>{
      const playerbet = await getBet();
      console.log("     *** Your bet size is: "+ playerbet + " STX")
    })

    it("Bet number ", async () =>{
      const playernumber = await getPlayerNumber();
      console.log("     *** Your bet number is: "+ playernumber)
    })

    it("Number from the roulette ", async () => {
      const casino = await getCasino();
      console.log("     *** The iron ball stopped at number: " + casino);
    })

    it("Checked bet on numbers ", async () => {
      const win = await getNumberWin();
          console.log("     *** Your bet on number won " + win + " STX");
    })

    it("Checked Odd/Even ", async () => {
      var win = await checkOdd();
      const casino = await getCasino();
      if(casino == 0)
        console.log("     *** Wheel's number is "+casino+". Both Odd/Even bets lose." );
      else if (win == "(ok false)")
        console.log("     *** Wheel's number "+casino+" is Even" );
      else if (win == "(ok true)")
        console.log("     *** Wheel's number "+casino+" is Odd" );
    })

    it("Checked bet on Odd/Even ", async () => {
      await execMethod("check-casino-odd");
      var win = await checkOddWin();
      console.log("     *** You won " + win + " STX on Odd/Even bet.");
    })

    it("Should increment bet", async () => {
      await execMethod("increment-bet");
      assert.equal(await getBet(), 110);
      await execMethod("increment-bet");
      assert.equal(await getBet(), 120);
    })
    
    it("Should decrement bet", async () => {
      await execMethod("decrement-bet");
      assert.equal(await getBet(), 110);
      await execMethod("decrement-bet");
      assert.equal(await getBet(), 100);
    })

    it("Should get hash", async () => {
      await execMethod("get-hash");
    })
  });
  after(async () => {
    await provider.close();
  });
});
