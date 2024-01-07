const toggleSwitch1 = document.getElementById("toggleSwitch1");
const toggleText1 = document.getElementById("toggleText1");
const lampON1 = document.getElementById("lamp_on1");
const lampOFF1 = document.getElementById("lamp_off1");

const toggleSwitch2 = document.getElementById("toggleSwitch2");
const toggleText2 = document.getElementById("toggleText2");
const lampON2 = document.getElementById("lamp_on2");
const lampOFF2 = document.getElementById("lamp_off2");

const toggleSwitch3 = document.getElementById("toggleSwitch3");
const toggleText3 = document.getElementById("toggleText3");
const lampON3 = document.getElementById("lamp_on3");
const lampOFF3 = document.getElementById("lamp_off3");

function generateRandomNumber(length) {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  );
}

const clientId = "clientId-traffic-web-2-" + generateRandomNumber(4);

client = new Paho.MQTT.Client("broker.hivemq.com", Number(8884), clientId);
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess: onConnect });

function onConnect() {
  console.log("onConnect");
  client.subscribe("traffic/raspico-2");
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    location.reload();
  }
}

function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);
  let data = JSON.parse(message.payloadString);
  if (control) {
    toggleSwitch.checked = false;
    lamp_off();
  } else if (control) {
    toggleSwitch.checked = true;
    lamp_on();
  }
  console.log(data);
}

function lamp_on(toggleSwitch, lampON, lampOFF, toggleText) {
  toggleSwitch.checked = true;
  toggleText.textContent = "ON";
  lampOFF.style.display = "none";
  lampON.style.display = "inline-block";
  message = new Paho.MQTT.Message("0");
  message.destinationName = "traffic/raspico-2"; // Assuming this topic is correct
  client.send(message);
}

function lamp_off(toggleSwitch, lampON, lampOFF, toggleText) {
  toggleSwitch.checked = false;
  toggleText.textContent = "OFF";
  lampON.style.display = "none";
  lampOFF.style.display = "inline-block";
  message = new Paho.MQTT.Message("1");
  message.destinationName = "traffic/raspico-2"; // Assuming this topic is correct
  client.send(message);
}

toggleSwitch1.addEventListener("change", function () {
  lamp_on(toggleSwitch1, lamp_on1, lamp_0ff1, toggleText1);
});

toggleSwitch2.addEventListener("change", function () {
  lamp_on(toggleSwitch2, lamp_on2, lamp_off2, toggleText2);
});

toggleSwitch3.addEventListener("change", function () {
  lamp_on(toggleSwitch3, lamp_on3, lamp_off3, toggleText3);
});

const toggleAuto = document.getElementById("toggleAuto");
const autoText = document.getElementById("autoText");
const manualText = document.getElementById("manualText");
let control = true;

toggleAuto.addEventListener("change", function () {
  if (this.checked) {
    control = true;
    autoText.style.color = "#0bc2b9";
    manualText.style.color = "#666";
    toggleSwitch1.disabled = true;
    toggleSwitch2.disabled = true;
    toggleSwitch3.disabled = true;
  } else {
    control = false;
    manualText.style.color = "#0bc2b9";
    autoText.style.color = "#666";
    toggleSwitch1.disabled = false;
    toggleSwitch2.disabled = true;
    toggleSwitch3.disabled = true;
  }
});
