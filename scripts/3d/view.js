/*
 *   Web based map editor for tanki online
 *   Copyright (C) 2023  Pyogenics <https://github.com/Pyogenics>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as THREE from "three";

class Renderer
{
	constructor()
	{
	}

	init()
	{
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000); // XXX: change this later
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.animate();
	}

	bindToCanvas(canvas)
	{
		this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
		this.init();
	}

	addObject(obj)
	{
		this.scene.add(obj);
	}

	animate()
	{
		requestAnimationFrame(() => { this.animate(); });
		this.renderer.render(this.scene, this.camera);
	}
}

export { Renderer };
