body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background: url('fundos.png') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #fff;
}

.topbar {
  text-align: center;
  padding: 10px 0;
}

.logo {
  height: 70px;
}

.main-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  flex: 1;
  overflow: hidden;
}

.models-panel {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px;
  overflow-y: auto;
}

.models-panel h3 {
  margin-top: 0;
  color: #4fa9ff;
  text-align: center;
}

.models-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.models-list li {
  padding: 10px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  text-align: center;
}

.models-list li:hover {
  background: #4fa9ff;
  color: white;
}

.viewer-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.viewer {
  width: 60%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  width: 100%;
  height: auto;
  transform: scale(0.8); /* 20% menor */
}

.controls {
  margin-top: 20px;
  text-align: center;
}

.swatches {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  gap: 10px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s;
}

.color-btn:hover {
  transform: scale(1.2);
}

.btn {
  padding: 10px 20px;
  background: #4fa9ff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-weight: 600;
  transition: background 0.3s;
}

.btn:hover {
  background: #0066cc;
}

.footer {
  text-align: center;
  padding: 10px;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.7);
}
