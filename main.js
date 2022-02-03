function calc_ip_subnet() {
	const ip_input = document.getElementById("ip_input").value;
	//const mask_input = document.getElementById("mask_input").value;

	let ip_separation = ip_input.split("/");
	let cidr_block = Number(ip_separation[1]);
	let ip_list = ip_separation[0].split(".").map((e) => Number(e));

	console.log(ip_list, cidr_block);

	let octet = calc_significant_octet(cidr_block);
	let octet_mask = calc_octet_mask(cidr_block);
	let magic_num = calc_magic_number(octet_mask);

	let mask = [];
	let subnet_ip = [];
	let broadcast_ip = [];

	for (let i = 0; i < 4; i++) {
		if (i < octet) {
			mask[i] = 255;
			subnet_ip[i] = ip_list[i];
			broadcast_ip[i] = ip_list[i];
		} else if (i === octet) {
			mask[i] = octet_mask;
			subnet_ip[i] = calc_subnet_id(ip_list[i], magic_num);
			broadcast_ip[i] = calc_broadcast_ip(subnet_ip[i], magic_num);
		} else if (i > octet) {
			mask[i] = 0;
			subnet_ip[i] = 0;
			broadcast_ip[i] = 255;
		}
	}

	//let host_range = calc_hosts_range(subnet_ip, broadcast_ip);

	output_subnet_info(ip_input, mask, subnet_ip, broadcast_ip);
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

function calc_subnet_id(octet_ip, magic_num) {
	return octet_ip - (octet_ip % magic_num);
}

function calc_broadcast_ip(octet_subnet, magic_num) {
	return octet_subnet + magic_num - 1;
}

// TODO fix
// Hosts: Subnet + 1 , Broadcast - 1
function calc_hosts_range(subnet_ip, broadcast_ip) {
	let hosts = [subnet_ip, broadcast_ip];
	hosts[0][hosts.length-1] += 1;
	hosts[1][hosts.length-1] -= 1;

	return hosts;
}

function calc_networks_total(magic_num) {
	return 256 / magic_num;
}

// TODO calculate total number of hosts
function calc_hosts_total() {
	return;
}

function output_subnet_info(ip_input, mask, subnet_ip, broadcast_ip) {
	const output_div = document.getElementById("form-output")

	output_div.innerHTML = `
		<h1>${ip_input}</h1>
		<table id="subnet-output">
			<tr>
				<th scope="row">IP Mask:</td>
				<td>${mask.join(".")}</td>
			</tr>
			<tr>
				<th scope="row">Subnet ID:</td>
				<td>${subnet_ip.join(".")}</td>
			</tr>
			<tr>
				<th scope="row">Broadcast:</td>
				<td>${broadcast_ip.join(".")}</td>
			</tr>
		</table>
	`;

	return;
}

function validate_address(ip_list) {
	for (const element of ip_list) {
		if (element < 0 || element > 255) { return false; }
	}

	// TODO validate ip and mask ranges
	return true;
}

// XXX attached to main function
// Convert CIDR to Octet Mask
function calc_cidr_mask(cidr_block) {
	let octet = Math.floor(cidr_block / 8);
	let octet_mask = 256 - (256 >> (cidr_block % 8));
	let mask = [];

	for (let i = 0; i < 4; i++) {
		if (i < octet) { mask[i] = 255; }
		else if (i === octet) { mask[i] = octet_mask; }
		else if (i > octet) { mask[i] = 0; }
	}

	return mask;
}

// debug/test
//for (let i = 1; i <= 32; i++) {
//	console.log("/" + i.toString() + ": " + calc_cidr_mask(i).join("."));
//}

document.getElementById("form_ip_subnet").addEventListener('submit', calc_ip_subnet);
