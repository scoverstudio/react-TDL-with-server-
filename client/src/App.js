import io from "socket.io-client";
import React from "react";
import shortid from "shortid";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      singleTask: {},
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

    this.setState({ singleTask: { name: this.state.taskName, id: shortid() } });
    this.addTask(this.state.singleTask);
    this.socket.emit("addTask", this.state.singleTask);

    this.setState({
      singleTask: { name: "" },
    });
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

  generateSingleTask = (e) => {
    this.setState({
      singleTask: { name: e.target.value, id: shortid() },
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
              value={this.state.singleTask.name}
              onChange={(e) => this.generateSingleTask(e)}
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
