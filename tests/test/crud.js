const Crud = artifacts.require("Crud");

contract("Crud", () => {
	let crud = null;

	before(async () => {
		crud = await Crud.deployed();
	});

	it("Should create a new user", async () => {
		await crud.create("John");
		let user = await crud.read(1);
		assert.equal(user[0].toNumber(), 1);
		assert.equal(user[1], "John");
	});

	it("Should update the user", async () => {
		await crud.update(1, "James");
		let user = await crud.read(1);
		assert.equal(user[1], "James");
	});
});
