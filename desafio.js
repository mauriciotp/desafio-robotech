/* 
  Para a realização do desafio, foi considerado que o controlador PID recebe um
  erro calculado a partir das medições dos sensores do robô, transformando o erro 
  em variável manipulada de forma que as rodas do robô reduzam ou aumentem a 
  velocidade para chegar até a bola.
*/

/* 
  O controle PID combina 3 conceitos para controlar o processo através do erro:
  O Proporcional, Integral e Derivativo.
*/

/* 
  Precisamos declarar as variáveis error e acc (acumulator), foi suposto que o 
  erro representa a subtração entre o ângulo theta (setpoint) e o valor atual 
  do ângulo medido pelos sensores.
*/

let error = 0;
let acc = 0;

/* 
  Agora é preciso definir as constantes de proporcionalidade, o ganho integral,
  o ganho derivativo e o intervalo de tempo. Tive dúvidas com relação aos 
  valores das constantes, logo, valores arbitários foram considerados.
*/

const kp = 1.6;
const ki = 1.1;
const kd = 0.7;
const ts = 2;

// Função que retorna o valor do setpoint e o valor do ângulo medido pelos sensores.

function updateInputValues() {
  const setpointValue = 70; // Valor arbitrário do ângulo theta em graus.
  const currentValue = 60; // Valor arbitrário do ângulo captado pelos sensores.

  return {
    setpointValue,
    currentValue,
  };
}

const uSat = 2; // Valor de saturação

/* 
  Laço que fica recalculando o erro e atualizando a saída enquanto a distância
  do robô até a bola seja maior que zero.
*/

const distanceToBall = 30; // Distância do robô até a bola (valor arbitrário).

while (distanceToBall > 0) {
  const { setpointValue, currentValue } = updateInputValues();
  const oldError = error;
  error = setpointValue - currentValue;
  acc = acc + ((error + oldError) / 2) * ts; // Expressão que representa a integral.
  u = kp * error + ki * acc + (kd * (error - oldError)) / ts; // Fórmula geral do PID.
  /*
    A ação integral causa um problema de wind-up, podendo desgovernar o robô,
    logo, podemos definir um valor de saturação e realizar uma verificação,
    zerando o accumulator caso a condição não satisfaça.
  */
  if (u < uSat) {
    acc = acc + ((error + oldError) / 2) * ts;
  } else {
    acc = 0;
  }
  // Agora precisamos alterar a velocidade das rodas conforme o valor da saída do PID.
  if (error > 0) {
    // Se o erro é positivo, podemos supor que a roda direita deve aumentar a velocidade.
    rightWheelSpeed = e;
  } else if (error < 0) {
    // Caso contrário, a roda esquerda deve diminuir a velocidade.
    leftWheelSpeed = -e;
  }
}
