"use client";
import React, { Fragment, useEffect, useState } from "react";
import "./style.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
//import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Modal, Button, Form } from "react-bootstrap";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/outline";
import Avt1 from "../../public/avt-1.png";
import Avt2 from "../../public/avt-2.png";

const employee = [
  { id: 1, name: "Employee 1", image: Avt1, role: "Cooker" },
  { id: 2, name: "Employee 2", image: Avt2, role: "Cashier" },
  { id: 3, name: "Employee 3", image: "./avt-3.png", role: "Jumper" },
  // Add more employees as needed
];

const CalendarPage = () => {
  const [calendarApi, setCalendarApi] = useState(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    image: [],
    role: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employees, setEmployees] = useState(() => {
    const storedEmployees =
      JSON.parse(localStorage.getItem("employees")) || employee;
    return storedEmployees;
  });

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");

    const handleEventReceive = (info) => {
      if (info.draggedEl) {
        info.draggedEl.parentNode.removeChild(info.draggedEl);
      }

      if (info.event) {
        calendarApi.addEvent(info.event);
      }
    };

    const handleDrop = (dropArg) => {
      let draggedEvent = dropArg.draggedEl;
      let eventTitle = draggedEvent.innerText.trim();
      let newEvent = {
        title: eventTitle,
        start: dropArg.date,
        allDay: dropArg.allDay,
      };
      calendarApi.addEvent(newEvent);
    };

    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          console.log(eventEl.querySelector(".employee-name").innerText.trim());
          return {
            title: eventEl.querySelector(".employee-name").innerText.trim(),
          };
        },
      });
    }

    if (calendarApi) {
      calendarApi.setOption("eventReceive", handleEventReceive);
      calendarApi.setOption("drop", handleDrop);
    }
  }, [calendarApi]);

  const handleCalendarReady = (calendar) => {
    //setCalendarApi(calendar.getApi());
    setCalendarApi(calendar.getApi());
  };

  const handleAddEmployee = () => {
    const updatedEmployees = [...employees, newEmployee];

    // Update the employee list with the new employee
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    setShowAddEmployeeModal(false);
    setNewEmployee({ id: "", name: "", image: [], role: "" });
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      const updatedEmployees = employees.filter(
        (emp) => emp.id !== selectedEmployee.id
      );
      setEmployees(updatedEmployees);
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      setSelectedEmployee(null);
    }
  };

  function getRandomColor(employee) {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  return (
    <>
      <main className="main">
        <div className="row d-flex flex-row">
          <div className="col-lg-3">
            <div
              id="external-events"
              style={{
                padding: "10px",
                textAlign: "center",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <h4>Employee List</h4>
              {employees.map((employee) => (
                <>
                  <div
                    className="fc-event"
                    key={employee.id}
                    onClick={() => handleEmployeeClick(employee)}
                    style={
                      selectedEmployee === employee
                        ? {
                            backgroundColor: "#f0e1fc",
                            color: "#000",
                            margin: "10px",
                            border: "1px dashed #eee",
                            borderRadius: "8px",
                          }
                        : {
                            backgroundColor: "white",
                            color: "#000",
                            margin: "10px",
                            border: "1px dashed #eee",
                            borderRadius: "8px",
                          }
                    }
                  >
                    <div className="row flex-nowrap d-flex items-center justify-content-flex-start pl-3">
                      <div
                        className="col-md-2"
                        style={{
                          backgroundColor: getRandomColor(employee), // You can define a function to get random colors
                          margin: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%", // Make it a circle
                          width: "40px", // Set your desired width
                          height: "40px", // Set your desired height
                          color: "white", // Text color
                          fontSize: "20px", // Text size
                        }}
                      >
                        {employee.name.substring(0, 2)}
                      </div>
                      <div
                        className="employee-name col-md-10 text-left"
                        style={{ marginLeft: "0" }}
                      >
                        {employee.name}{" "}
                        <div className="employee-role text-slate-500">
                          {employee.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              <div className="row d-flex flex-row items-center justify-center">
                <div className="col-md-6">
                  <Button
                    variant="primary"
                    onClick={() => setShowAddEmployeeModal(true)}
                    style={{ padding: "4px 20px" }}
                  >
                    Add
                  </Button>
                </div>

                {selectedEmployee && (
                  <div className="col-md-6">
                    <Button variant="secondary" onClick={handleDeleteEmployee}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                // resourceTimelinePlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineWeek,dayGridMonth,timeGridWeek",
              }}
              // resources={["Cashier", "Cook", "Jumper"]}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              initialView="dayGridMonth"
              events={employees}
              onReady={(calendar) => handleCalendarReady(calendar)}
            />
          </div>
        </div>
        {/*----------- Add Employee Modal --------- */}
        <Modal
          show={showAddEmployeeModal}
          onHide={() => setShowAddEmployeeModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEmployeeId">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter ID"
                  value={newEmployee.id}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, id: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formEmployeeName">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </Form.Group>
              {/* <Form.Group controlId="formEmployeeImage">
                <Form.Label>Employee Image</Form.Label>
               <Form.Control
                  type="file"
                  accept="image/*"
                  placeholder="Insert an Image"
                  value={newEmployee.image}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, image: e.target.files[0] })
                  }
                />
              </Form.Group> */}

              <Form.Group controlId="formEmployeeRole">
                <Form.Label>Employee Role</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                >
                  <option>Select Employee Role</option>
                  <option value="Cooker">Cooker</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Jumper">Jumper</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddEmployeeModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleAddEmployee}>
              Add Employee
            </Button>
          </Modal.Footer>
        </Modal>
        {/*------------------ */}
      </main>
    </>
  );
};

export default CalendarPage;
