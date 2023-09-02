import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friend, setFriend] = useState(initialFriends);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handelAddFriend(f) {
    setFriend((friend) => [...friend, f]);
  }

  function handelSelection(f) {
    setSelectedFriend((cur) => (cur && cur.id === f.id ? null : f));
    setFormOpen(false);
  }

  function handelSplitBill(value) {
    setFriend((friend) =>
      friend.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friend={friend}
          setFormOpen={setFormOpen}
          handelSelection={handelSelection}
          selectedFriend={selectedFriend}
        />
        {
          <FormAddFriends
            handelAddFriend={handelAddFriend}
            setFriend={setFriend}
            formOpen={formOpen}
            setFormOpen={setFormOpen}
          />
        }
        {formOpen ? (
          <Button style={{ margin: "10px" }} onClick={() => setFormOpen(false)}>
            Close
          </Button>
        ) : (
          <Button style={{ margin: "10px" }} onClick={() => setFormOpen(true)}>
            Add Friends
          </Button>
        )}
      </div>
      {selectedFriend && (
        <Form
          handelSplitBill={handelSplitBill}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ friend, setFormOpen, handelSelection, selectedFriend }) {
  return (
    <ol>
      <Friends
        friend={friend}
        setFormOpen={setFormOpen}
        handelSelection={handelSelection}
        selectedFriend={selectedFriend}
      />
    </ol>
  );
}

function Friends({ selectedFriend, friend, setFormOpen, handelSelection }) {
  return friend.map((f) => (
    <li
      key={f.id}
      className={selectedFriend && selectedFriend.id === f.id ? "selected" : ""}
    >
      <img src={f.image} alt={f.name} />
      <h3>{f.name}</h3>
      {f.balance < 0 && (
        <p className="red">
          You owe {f.name} ${Math.abs(f.balance)}
        </p>
      )}

      {f.balance > 0 && (
        <p className="green">
          {f.name} owes you ${f.balance}
        </p>
      )}

      {f.balance === 0 && <p>You and {f.name} are even</p>}

      <Button onClick={() => handelSelection(f)}>
        {selectedFriend && selectedFriend.id === f.id ? "Close" : "Open"}
      </Button>
    </li>
  ));
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriends({ handelAddFriend, formOpen, setFormOpen }) {
  const randomNumbers = Math.floor(Math.random() * 50) + 1;

  const [name, setName] = useState("");
  const [image, setImg] = useState(
    "https://xsgames.co/randomusers/assets/avatars/pixel/"
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      name,
      image: `${image}${randomNumbers}.jpg`,
      balance: 0,
      id: randomNumbers,
    };
    handelAddFriend(newFriend);

    setFormOpen(false);
    setName("");

    console.log(randomNumbers);
  }

  return (
    formOpen && (
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🫂Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>📷Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImg(e.target.value)}
        />

        <Button onClick={handleSubmit}>Add</Button>
      </form>
    )
  );
}

function Form({ handelSplitBill, selectedFriend }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    handelSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>🤑Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>🧍Your Expenses</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      />

      <label>🧑‍🤝‍🧑{selectedFriend.name} Expenses</label>
      <input type="number" disabled value={paidByFriend} />

      <label style={{ display: "flex" }}>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
