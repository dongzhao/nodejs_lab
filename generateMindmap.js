import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import fs from 'fs';

const textTree = `Music
  Genre
    Rock
    Pop
    Jazz
    Classical
  Song
    Bohemian Rhapsody
    Blank Space`;


/**
 * 缩进文本解析器：把带空格缩进的文本转为树结构
 */
function parseIndentedText(text) {
  const lines = text.trim().split("\n");
  const root = { name: "", children: [] };
  const stack = [{ node: root, indent: -1 }];

  for (const line of lines) {
    const match = line.match(/^(\s*)(.+)$/);
    if (!match) continue;
    const indentStr = match[1];
    const name = match[2].trim();
    const indent = indentStr.length;

    // 找到父节点
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].node;
    const newNode = { name, children: [] };
    parent.children.push(newNode);
    stack.push({ node: newNode, indent });
  }
  return root.children[0];
}

/**
 * D3 径向树生成 SVG
 */
function renderTree(data) {
  const dom = new JSDOM(`<!DOCTYPE html>`);
  global.document = dom.window.document;
  global.window = dom.window;

  const width = 1000;
  const height = 1000;
  const svg = d3.select(document.body)
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const treeLayout = d3.tree()
    .size([2 * Math.PI, 420]) // [角度范围, 最大半径]
    .separation((a, b) => (a.parent === b.parent ? 1.2 : 1.6));

  const root = d3.hierarchy(data);
  treeLayout(root);

  // 绘制连接线
  g.selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#5588bb")
    .attr("stroke-width", 1.4)
    .attr("d", d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y)
    );

  // 绘制文字
  g.selectAll("text")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("dy", "0.32em")
    .attr("fill", "#222222")
    .attr("font-size", "12px")
    .attr("transform", d => {
      const angle = d.x * 180 / Math.PI - 90;
      const flip = angle > 90 ? angle - 180 : angle;
      return `rotate(${angle}) translate(${d.y + 8},0) rotate(${flip - angle})`;
    })
    .text(d => d.data.name);

  return svg.html();
}

// 主流程
const treeData = parseIndentedText(textTree);
const svgContent = renderTree(treeData);
fs.writeFileSync("mindmap.svg", svgContent, "utf8");
console.log("✅ 生成完成: mindmap.svg");