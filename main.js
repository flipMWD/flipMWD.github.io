function calc_ip_subnet() {
	let ip_input = document.getElementById("ip-input").value;

	let ip_separation = ip_input.split("/");
	let cidr_block = Number(ip_separation[1]);
	let ip_list = ip_separation[0].split(".").map((e) => Number(e));

	console.log(ip_list, cidr_block);

	let octet = calc_significant_octet(cidr_block);
	let octet_mask = calc_octet_mask(cidr_block);
	let magic_num = calc_magic_number(octet_mask);

	let mask = [];
	let subnet = [];
	let broadcast = [];

	for (let i = 0; i < 4; i++) {
		if (i < octet) {
			mask[i] = 255;
			subnet[i] = ip_list[i];
			broadcast[i] = ip_list[i];
		} else if (i === octet) {
			mask[i] = octet_mask;
			subnet[i] = calc_subnet_id(ip_list[i], magic_num);
			broadcast[i] = calc_broadcast(subnet[i], magic_num);
		} else if (i > octet) {
			mask[i] = 0;
			subnet[i] = 0;
			broadcast[i] = 255;
		}
	}

	output_subnet_info(ip_input, mask, subnet, broadcast);
	ip_input = "";
}

function calc_significant_octet(cidr_block) {
	return Math.floor(cidr_block / 8);
}

function calc_octet_mask(cidr_block) {
	return 256 - (256 >> (cidr_block % 8));
}

function calc_magic_number(octet_mask) {
	return 256 - octet_mask;
}

function calc_subnet_id(octet_val, magic_num) {
	return octet_val - (octet_val % magic_num);
}

function calc_broadcast(octet_subnet, magic_num) {
	return octet_subnet + magic_num - 1;
}

function calc_networks_total(magic_num) {
	return 256 / magic_num;
}

function output_subnet_info(ip_input, mask, subnet, broadcast) {
	const output_div = document.getElementById("form-output")

	output_div.innerHTML = `
		<h1>${ip_input}</h1>
		<table id="subnet-output">
			<tr>
				<th scope="row">Subnet Mask:</td>
				<td>${mask.join(".")}</td>
			</tr>
			<tr>
				<th scope="row">Subnet ID:</td>
				<td>${subnet.join(".")}</td>
			</tr>
			<tr>
				<th scope="row">Broadcast:</td>
				<td>${broadcast.join(".")}</td>
			</tr>
		</table>
	`;

	return;
}

document.getElementById("form-ip-subnet").addEventListener('submit', calc_ip_subnet);
