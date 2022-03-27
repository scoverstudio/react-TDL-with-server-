import io from "socket.io-client";
import React from "react";
import shortid from "shortid";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: "",
    };
  }
  componentDidMount = () => {
    this.socket = io("http://localhost:8000/");
    this.socket.on("addTask", (task) => this.addTask(task));
    this.socket.on("removeTask", (id) => this.removeTask(id));
    this.socket.on("updateData", (serverTasks) =>
      this.updateTasks(serverTasks)
    );
  };

  addTask = (task) => {
    this.setState({
      tasks: [...this.state.tasks, task],
    });
  };

  submitForm = (e) => {
    e.preventDefault();

    const singleTask = { name: this.state.taskName, id: shortid() };

    this.addTask(singleTask);
    this.socket.emit("addTask", singleTask);

    this.setState({ taskName: "" });
  };

  removeTask = (id) => {
    const getUpdatedTasks = this.state.tasks.filter((task) => task.id !== id);
    this.setState({ tasks: getUpdatedTasks });
  };

  removeHandler = (id) => {
    this.removeTask(id);
    this.socket.emit("removeTask", id);
  };

  updateTasks = (serverTasks) => {
    this.setState({
      tasks: serverTasks,
    });
  };

  render() {
    return (
      <div>
        <header>
          <h1>toDoList.app</h1>
        </header>
        <section className="task-section" id="task-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map((task) => (
              <li key={task.id} className="task">
                {task.name}
                <button
                  onClick={() => this.removeHandler(task.id)}
                  className="btn btn--red"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={(e) => this.submitForm(e)} id="add-task-form">
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.taskName}
              onChange={(e) => this.setState({ taskName: e.target.value })}
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
