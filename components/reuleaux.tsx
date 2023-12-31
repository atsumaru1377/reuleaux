/*
Use matter.js on next.js
Make a reuleaux triangle which roll between two walls which lean 30 degrees from horizontal
*/

import React from 'react';
import { useEffect, useRef } from 'react';
import { Engine, Render, World, Bodies, Body, Events, Composite, Runner, Mouse, MouseConstraint, Common } from 'matter-js';

const makeReuleaux = (x:number, y:number, radius:number, sides:number) => {
	const points = [];
	points.push({x:x, y:y});
	for (let j = 0; j < 3; j++) {
		const centerX:number = points[points.length -1].x;
		const centerY:number = points[points.length-1].y;
		const startAngle:number = Math.PI / 3 * 4 * j;
		const stepAngle:number = Math.PI / 3 / sides;
		for (let i = 0; i < sides; i++) {
			const angle = startAngle + stepAngle * i;
			const p = {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle)
			};
			points.push(p);
		}
	}
	return points;
}
const Reuleaux: React.FC = () => {
	useEffect(() => {
		const width = 600;
		const height = 400;
		const engine = Engine.create();
		const world = engine.world;

		const render = Render.create({
			element: document.body,
			engine: engine,
			options: {
				width: width,
				height: height,
				wireframes: false
			}
		});

		const leftWall = Bodies.rectangle(0, height/2, 40, height, {
			isStatic: true,
			render: { fillStyle: '#99ffff' }
		});
		const rightWall = Bodies.rectangle(width, height/2, 40, height, {
			isStatic: true,
			render: { fillStyle: '#99ffff' }
		});
		const ground = Bodies.rectangle(width/2, height, width, 40, {
			isStatic: true,
			render: { fillStyle: '#99ffff' }
		});

		const slope = Bodies.rectangle(width*1/2, height*2/4, width*2/2, 20, {
			isStatic: true,
			angle: Math.PI * 1 / 12,
			render: { fillStyle: '#99ffff' }
		})
		const slopeCeil = Bodies.rectangle(width*1/2, height*2/4 - 40 - 20 / Math.cos(Math.PI * 1 / 12), width*1/2, 20, {
			isStatic: true,
			angle: Math.PI * 1 / 12,
			render: { fillStyle: '#99ffff' }
		})

		const reuleauxPoints = makeReuleaux(width*1/8, height*1/8, 40, 200);

		const reuleaux = Bodies.fromVertices(width*1/8, height*1/8, [reuleauxPoints], {
			friction: 0.001,
			render: { fillStyle: '#ff9999' },

		});

		const reuleauxs = []
		for (let i = 0; i < 8; i++) {
			reuleauxs.push(
				Bodies.fromVertices(Common.random(0, width), Common.random(0, height), [reuleauxPoints], {
					friction: 0.001,
					render: { fillStyle: '#ff9999' },
				})
			)
		}

		// Create boundary
		Composite.add(world, [leftWall, rightWall, ground, slope, slopeCeil]);
		Composite.add(world, [reuleaux])
		Composite.add(world, reuleauxs)
		const mouse = Mouse.create(render.canvas);
		const mouseConstraint = MouseConstraint.create(engine,{
			mouse: mouse,
			constraint: {
				stiffness : 0.2,
				render : {
					visible: false
				}
			}
		})
		Composite.add(world, mouseConstraint)
		Render.run(render);
		Engine.run(engine);

		return () => {
			Render.stop(render);
			Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, []);

	return (
		<div/>
	);
}

export default Reuleaux;