let To = 2;
      let W = 1300;
      var scale = 2;
      let y_scale = 250;
      let x_scale = 25;
      let T = 1.5;
      let T_p = 1;
      let k = 10; // adjustment constant
      let tex;
      let cn;
      let description1;
      let description2;

      function setup() {
          createCanvas(1500, 700);
          frameRate(6);
          
          // Create sliders with custom styles
          slider = createSlider(1, 15, 1, 0.1);
          slider.position(0.1 * width, 0.5 * height);
          slider.style('width', '300px');
          
          speed = createSlider(0.001, 2, 0.005, 0.001);
          speed.position(0.1 * width, 0.65 * height);
          speed.style('width', '300px');
          
          // Create custom checkbox
          checkbox = createCheckbox('Animate', false);
          checkbox.position(0.1 * width, 0.575 * height);
          checkbox.style('font-size', '18px');
          
          // Create KaTeX render for T_p
          cn = createP();
          cn.style('font-size', '18px');
          cn.position(0.075 * width, 0.475 * height);
          katex.render("T_p", cn.elt);
          
          // Create KaTeX render for formula
          tex = createP();
          tex.style('font-size', '28px');
          tex.position(width * 0.4, height * 2 / 5);
          
          // KaTeX descriptions for graphs
          description1 = createP();
          description1.style('font-size', '18px');
          description1.position(0.5 * width - 150, height * 0.3);  // Adjust position to center and move up
          katex.render("Periodic \\ Pulse \\ Waveform", description1.elt);

          description2 = createP();
          description2.style('font-size', '18px');
          description2.position(0.5 * width - 150, height * 0.85);  // Adjust position to center
          katex.render("Sinc \\ Function \\ in \\ Fourier \\ Series", description2.elt);
      }

      function draw() {
          // White background
          background(255);
          
          fill(0); // black text color for better contrast
          noStroke();
          textSize(17);
          textAlign(CENTER, CENTER);
          text('Speed', 0.075 * width, 0.665 * height);
          
          T_p = slider.value();
          if (T < T_p) {
              T = T_p + 0.5;
          }
          if (checkbox.checked()) {
              T += speed.value();
          }
          
          stroke(0); // black stroke for graph elements
          // Graph drawing
          push();
          translate(0, -0.25 * height);
          graph();
          pop();

          push();
          translate(0, 0.25 * height);
          graph();
          pop();
          
          // Sinc Function
          push();
          noFill();
          translate(0.5 * width, 0.75 * height);
          scale(0.5);
          stroke(44, 206, 144); // green for sinc curve
          strokeWeight(4);
          beginShape();
          for (let x = -0.03 * width; x <= 0.03 * width; x += 0.01) {
              vertex(x_scale * x, -y_scale * sinc(x));
          }
          endShape();
          pop();

          // Coefficients
          push();
          noFill();
          translate(0.5 * width, 0.75 * height);
          scale(0.5);
          for (let x = 0; x <= 0.03 * width; x += k * T_p / T) {
              stroke(50, 150, 50); // green for coefficient lines
              strokeWeight(3);
              line(x_scale * x, 0, x_scale * x, -y_scale * sinc(x));
              strokeWeight(8);
              point(x_scale * x, -y_scale * sinc(x));
          }
          
          for (let x = 0; x >= -0.03 * width; x -= k * T_p / T) {
              stroke(50, 150, 50); // green for coefficient lines
              strokeWeight(3);
              line(x_scale * x, 0, x_scale * x, -y_scale * sinc(x));
              strokeWeight(8);
              point(x_scale * x, -y_scale * sinc(x));
          }
          pop();

          ppf();

          // Key press actions
          if (keyIsDown(LEFT_ARROW) && T > T_p + 0.5) {
              T -= 0.5;
          }

          if (keyIsDown(RIGHT_ARROW)) {
              T += 0.5;
          }

          // KaTeX rendering for formula
          push();
          var a = concat("{c_n} = {{{", nfc(T_p, 2));
          var a1 = concat(a, "}} \\over");
          var a2 = concat(a1, nfc(T, 2));
          var b = concat(a2, "}{\\mathop{\\rm sinc}\\nolimits} \\left( {{{n{");
          var b1 = concat(b, nfc(T_p, 2));
          var b2 = concat(b1, "}} \\over");
          var c = concat(b2, nfc(T, 2));
          var d = concat(c, '}} \\right)');
          katex.render(d, tex.elt);
          pop();

          fill(0);
          textSize(18);
          textAlign(CENTER, CENTER);
          // Description text is now handled by KaTeX rendering
      }

      function graph() {
          noFill();
          stroke(0); // black stroke for graph lines
          strokeWeight(0.5);
          line(0.1 * width, 0.5 * height, 0.9 * width, 0.5 * height); // Horizontal line
          triangle(0.095 * width, 0.5 * height, 0.1 * width, 0.5 * height - 3, 0.1 * width, 0.5 * height + 3);
          triangle(0.905 * width, 0.5 * height, 0.9 * width, 0.5 * height - 3, 0.9 * width, 0.5 * height + 3);
      }

      function sinc(x) {
          if (x != 0) {
              return sin(x) / x;
          } else {
              return 1;
          }
      }

      function ppf() {
          push();
          noFill();
          translate(0.5 * width, 0.25 * height);
          scale(0.5);
          stroke(44, 206, 144); // red for ppf curve
          strokeWeight(4);
          beginShape();
          for (let x = 0; x <= 0.03 * width; x += T) {
              vertex(x_scale * (x - 0.5 * T_p), 0);
              vertex(x_scale * (x - 0.5 * T_p), -y_scale);
              vertex(x_scale * x, -y_scale);
              vertex(x_scale * (x + 0.5 * T_p), -y_scale);
              vertex(x_scale * (x + 0.5 * T_p), 0);
          }
          endShape();
          
          beginShape();
          vertex(x_scale * (-0.5 * T_p), 0);
          for (let x = -T; x >= -0.03 * width; x -= T) {
              vertex(x_scale * (x + 0.5 * T_p), 0);
              vertex(x_scale * (x + 0.5 * T_p), -y_scale);
              vertex(x_scale * x, -y_scale);
              vertex(x_scale * (x - 0.5 * T_p), -y_scale);
              vertex(x_scale * (x - 0.5 * T_p), 0);
          }
          endShape();
          pop();
      }
