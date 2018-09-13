<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">vue-element-admin</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
    </el-form>
		<div id="indexLizi"></div>
  </div>
</template>

<script>
import THREE from "@/utils/three";
export default {
  name: 'Login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur'}],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
	mounted() {
		this.liziInit();
	},
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
		liziInit() {
			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;
			var SEPARATION = 90;
			var AMOUNTX = 50;
			var AMOUNTY = 50;
			var container;
			var particles, particle;
			var count;
			var camera;
			var scene;
			var renderer;
			var mouseX = 0;
			var mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			init();
			this.interval = setInterval(loop, 1000 / 60);
			function init() {
				container = document.createElement("div");
				container.style.position = "relative";
				container.style.top = "200px";
				document.getElementById("indexLizi").appendChild(container);
				camera = new THREE.Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
				camera.position.z = 1000;
				scene = new THREE.Scene();
				renderer = new THREE.CanvasRenderer();
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				particles = new Array();
				var i = 0;
				var material = new THREE.ParticleCircleMaterial(0x097bdb, 1);
				for (var ix = 0; ix < AMOUNTX; ix++) {
					for (var iy = 0; iy < AMOUNTY; iy++) {
						particle = particles[i++] = new THREE.Particle(material);
						particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2;
						particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2;
						scene.add(particle);
					}
				}
				count = 0;
				container.appendChild(renderer.domElement);
				document.addEventListener("mousemove", onDocumentMouseMove, false);
				document.addEventListener("touchmove", onDocumentTouchMove, false);
			}
			function onDocumentMouseMove(event) {
				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;
			}
			function onDocumentTouchMove(event) {
				if (event.touches.length == 1) {
					event.preventDefault();
					mouseX = event.touches[0].pageX - windowHalfX;
					mouseY = event.touches[0].pageY - windowHalfY;
				}
			}
			function loop() {
				camera.position.x += (mouseX - camera.position.x) * 0.05;
				//                    camera.position.y += ( - mouseY - camera.position.y ) * .05;
				camera.position.y = 364;
				var i = 0;
				for (var ix = 0; ix < AMOUNTX; ix++) {
					for (var iy = 0; iy < AMOUNTY; iy++) {
						particle = particles[i++];
						particle.position.y =
							Math.sin((ix + count) * 0.3) * 50 +
							Math.sin((iy + count) * 0.5) * 50;
						particle.scale.x = particle.scale.y =
							(Math.sin((ix + count) * 0.3) + 1) * 2 +
							(Math.sin((iy + count) * 0.5) + 1) * 2;
					}
				}
				renderer.render(scene, camera);
				count += 0.1;
			}
		}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
		z-index: 99;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
