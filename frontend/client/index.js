import Web3 from "web3";
import Crud from "../build/contracts/Crud.json";

let web3;
let crud;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      window.ethereum
        .enable()
        .then(() => {
          resolve(new Web3(window.ethereum));
        })
        .catch((e) => {
          reject(e);
        });
      return;
    }
    if (typeof window.web3 !== "undefined") {
      return resolve(new Web3(window.web3.currentProvider));
    }
    resolve(new Web3("http://localhost:9545"));
  });
};

const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
  return new web3.eth.Contract(Crud.abi, Crud.networks[deploymentKey].address);
};

const initApp = () => {
  // get DOM elements
  const $create = document.getElementById("create");
  const $createResult = document.getElementById("create-result");
  const $read = document.getElementById("read");
  const $readResult = document.getElementById("read-result");
  const $edit = document.getElementById("edit");
  const $editResult = document.getElementById("edit-result");
  const $delete = document.getElementById("delete");
  const $deleteResult = document.getElementById("delete-result");

  // add accounts
  let accounts = [];
  web3.eth.getAccounts().then((_accounts) => (accounts = _accounts));

  // get data from form
  $create.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let name = evt.target.elements[0].value;

    // call create function in the smart contract
    crud.methods
      .create(name)
      .send({ from: accounts[0] })
      .then(() => {
        $createResult.innerHTML = `New user ${name} was added to the contract`;
      })
      .catch((err) => {
        $createResult.innerHTML = `Unable to create new user due to an error`;
        console.error(err);
      });
  });

  // get user by id
  $read.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const id = evt.target.elements[0].value;
    // call read method on the smart contract
    crud.methods
      .read(id)
      .call()
      .then((result) => {
        $readResult.innerHTML = `Id: ${result[0]}, User: ${result[1]}`;
      })
      .catch((err) => {
        $readResult.innerHTML = `There was an error reading the results`;
        console.error(err);
      });
  });

  // update user
  $edit.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const id = evt.target.elements[0].value;
    const name = evt.target.elements[1].value;
    // call update method on the smart contract
    crud.methods
      .update(id, name)
      .send({ from: accounts[0] })
      .then(() => {
        $editResult.innerHTML = `Changed user ${id} to ${name}`;
      })
      .catch((err) => {
        $editResult.innerHTML = `Failed to update the User`;
        console.error(err);
      });
  });
  // delete user
  $delete.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const id = evt.target.elements[0].value;
    // call delete method on the smart contract
    crud.methods
      .destroy(id)
      .send({ from: accounts[0] })
      .then(() => {
        $deleteResult.innerHTML = `Deleted user ${id}`;
      })
      .catch((err) => {
        $deleteResult.innerHTML = `Could not delete user ${id}`;
        console.error(err);
      });
  });
};
// load page
document.addEventListener("DOMContentLoaded", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      crud = initContract();
      initApp();
    })
    .catch((e) => console.log(e.message));
});
