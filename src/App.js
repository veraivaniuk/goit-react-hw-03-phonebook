import "./App.css";
import Container from "./components/Container/";
import Section from "./components/Section";
import SubmitForm from "./components/SubmitForm";
import List from "./components/List";
import FilterContacts from "./components/FilterContacts";
import { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class App extends Component {
  state = {
    contacts: [ ],
    filter: "",
  };

  onSubmitHandler = (data) => {
    console.log(this.state.contacts);
    if (this.state.contacts.find((el) => el.name.includes(data.name))) {
      const notify = () => toast.warn(`${data.name} is already in contacts!`);
      return notify();
    }

    this.setState((state) => ({
      contacts: [
        { name: data.name, id: uuidv4(), number: data.number },
        ...this.state.contacts,
      ],
    }));
    //this.setState({ name: data.name })
  };

  handleFilterName = (e) => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };
  // onDelete = (e) => {
  // console.log(e);
  // }

  onDelete = (id) => {
    console.log(id);
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((el) => el.id !== id),
    }));
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({contacts: parsedContacts})
    }
    //onsole.log("монтаж");
    }

  componentDidUpdate(prevProps, prevState) {
    if(prevState !== this.state){
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts))
    };
  }


  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Container>
        <Section title="Phonebook">
          <SubmitForm onSubmit={this.onSubmitHandler} />
        </Section>
        <Section title="Contacts">
          <FilterContacts
            filter={filter}
            handleFilterName={this.handleFilterName}
          />
          <List contacts={visibleContacts} onDelete={this.onDelete} />
        </Section>
        <ToastContainer />
      </Container>
    );
  }
}
