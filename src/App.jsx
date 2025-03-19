import { useState } from "react";

import "./App.css";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];
export const Header = () => {
  return (
    <div className="header">
      <h1>🏝️ Far Away 🧳</h1>
    </div>
  );
};

const Form = ({ onAddItems }) => {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return; //returns nothing if there is no desc
    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>what do you need for your trip</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="addbutton">ADD</button>
    </form>
  );
};
function Item({ item, onRemove, onToggle }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggle(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onRemove(item.id)}>X</button>
    </li>
  );
}
const PackingList = ({ items, onRemove, onToggle, onClear }) => {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onRemove={onRemove}
            onToggle={onToggle}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input"> sort by input order</option>
          <option value="description"> sort by Description</option>
          <option value="packed"> sort by packed status</option>
        </select>
        <button className="clearbtn" onClick={onClear}>
          Clear List
        </button>
      </div>
    </div>
  );
};
const Stats = ({ items }) => {
  if (!items.length)
    return <p className="stats">Start by adding items to your packing list</p>;

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer>
      <p className="stats">
        <em>
          {percentage === 100
            ? "you are ready to go !"
            : `      you have ${numItems} items on your list and you already picked
          ${numPacked} (${percentage}%)`}
        </em>
      </p>
    </footer>
  );
};

function App() {
  const [items, setItems] = useState(initialItems);
  function handleItems(item) {
    setItems((items) => [...items, item]);
  }
  function removeItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleToggle(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function handleClear() {
    const confirmMessage = window.confirm(
      "are you sure you wish to remove all items from the list"
    );
    if (confirmMessage) setItems([]);
  }

  return (
    <div className="app">
      <Header />
      <Form onAddItems={handleItems} />
      <PackingList
        items={items}
        onRemove={removeItem}
        onToggle={handleToggle}
        onClear={handleClear}
      />
      <Stats items={items} />
    </div>
  );
}

export default App;
