const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found!" });
  res.json(employees);
};

const createEmployee = async (req, res) => {
  // const newEmployee = {
  //   id: (data.employees[data.employees.length - 1].id + 1) | 1,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  // };
  // console.log(newEmployee);
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "Firstname and lastname are required!" });
  }
  // if (!newEmployee.firstname || !newEmployee.lastname) {
  //   return res
  //     .status(400)
  //     .json({ message: "first name and last name are required!" });
  // }
  // data.setEmployees([...data.employees, newEmployee]);
  // // console.log(data.employees);
  // res.status(201).json(data.employees);
  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required!" });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ID ${req.body.id}` });
  }
  // const employee = data.employees.find(
  //   (employee) => employee.id === parseInt(req.body.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.body.id} Not Found!` });
  // }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  // const filteredArray = data.employees.filter(
  //   (Employee) => Employee.id !== parseInt(req.body.id)
  // );
  // const unSortedArray = [...filteredArray, employee];
  // data.setEmployees(
  //   unSortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  // );
  // res.json(data.employees);
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID is required!" });
  }
  // const employee = data.employees.find(
  //   (employee) => employee.id === parseInt(req.body.id)
  // );
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.body.id} Not Found!` });
  // }
  const result = await employee.deleteOne(); //{ _id: req.body.id }
  // const result = await employee.deleteOne({ _id: req.body.id });
  
  res.json(result);
  // const filteredArray = data.employees.filter(
  //   (Employee) => Employee.id !== parseInt(req.body.id)
  // );
  // data.setEmployees([...filteredArray]);
  // res.json(data.employees);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID is required!" });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }
  // const employee = data.employees.find(
  //   (employee) => employee.id === parseInt(req.body.id)
  // );
  // if (!employee) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.body.id} Not Found!` });
  // }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
