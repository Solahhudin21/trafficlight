const toggleSwitch1 = document.getElementById("toggleSwitch1");
const toggleText1 = document.getElementById("toggleText1");
const led1_on = document.getElementById("led1_on");
const led1_off = document.getElementById("led1_off");

const toggleSwitch2 = document.getElementById("toggleSwitch2");
const toggleText2 = document.getElementById("toggleText2");
const led2_on = document.getElementById("led2_on");
const led2_off= document.getElementById("led2_off");

const toggleSwitch3 = document.getElementById("toggleSwitch3");
const toggleText3 = document.getElementById("toggleText3");
const led3_on = document.getElementById("led3_on");
const led3_off = document.getElementById("led3_off");

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
  client.subscribe("traffic/web-2");
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
    led1_off();
  } else if (control) {
    toggleSwitch.checked = true;
    led1_on();
  }
  console.log(data);
}

function led1_on(toggleSwitch, led1_on, led1_off, toggleText) {
  toggleSwitch.checked = true;
  toggleText.textContent = "ON";
  lampOFF.style.display = "none";
  lampON.style.display = "inline-block";
  message = new Paho.MQTT.Message("0");
  message.destinationName = "traffic/web-2"; // Assuming this topic is correct
  client.send(message);
}

function led1_off(toggleSwitch, led1_on, led1_off, toggleText) {
  toggleSwitch.checked = false;
  toggleText.textContent = "OFF";
  lampON.style.display = "none";
  lampOFF.style.display = "inline-block";
  message = new Paho.MQTT.Message("1");
  message.destinationName = "traffic/web-2"; // Assuming this topic is correct
  client.send(message);
}

toggleSwitch1.addEventListener("change", function () {
  led1_on(toggleSwitch1, led1_on, led1_0ff, toggleText1);
});

toggleSwitch2.addEventListener("change", function () {
 led2_on(toggleSwitch2, led2_on, led2_off, toggleText2);
});

toggleSwitch3.addEventListener("change", function () {
  led3_on(toggleSwitch3, led3_on, led3_off, toggleText3);
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
