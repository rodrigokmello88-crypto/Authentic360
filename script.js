body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  background: url('fundos.png') center/cover no-repeat;
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #fff;
  overflow: hidden;
}

/* LOGO */
.topbar {
  text-align: center;
  padding: 15px 0;
}

.logo {
  height: 65px;
}

/* LAYOUT */
.main-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  flex: 1;
  overflow: hidden;
}

/* PAINEL LATERAL */
.models-panel {
  background-color: rgba(0, 0, 0, 0.55);
  padding: 20px;
  overflow-y: auto;
  backdrop-filter: blur(8px);
}

.models-panel h3 {
  margin-top: 0;
  color: #4fa9ff;
  text-align: center;
  font-weight: 600;
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

/* VISUALIZAÇÃO */
.viewer-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.viewer {
  width: 55%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.viewer-bg {
  background-color: rgba(180, 180, 180, 0.8);
  border-radius: 20px;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
}

canvas {
  width: 100%;
  height: auto;
  transform: scale(0.45); /* 🔹 Copos menores */
}

/* CONTROLES */
.controls {
  margin-top: 25px;
  text-align: center;
}

.swatches {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  gap: 12px;
}

.color-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid #ccc;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s, border 0.2s;
}

.color-btn:hover {
  transform: scale(1.2);
  border-color: white;
}

.btn {
  padding: 10px 22px;
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

/* RODAPÉ */
.footer {
  text-align: center;
  padding: 8px;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.6);
}
