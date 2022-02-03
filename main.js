function calc_ip_subnet() {
	const ip_input = document.getElementById("ip_input").value;
	const mask_input = document.getElementById("mask_input").value;
	// value checks

	let cidr_block = ip_input.split("/")[-1]
	let ip_list = ip_input.split(".").map((e) => Number(e));
	let mask_list = mask_input.split(".").map((e) => Number(e));

	// console.log(">>> " + mask_list.join(".") + (validate_address(mask_list) ? " Valid" : "."));

	// if (validate_address(ip_list)) { console.log(ip_list.toString()); }

	// validate ip and cidr
	// console.log(ip_input + " > " + mask_input);
}

function validate_address(ip_list) {
	for (const element of ip_list) {
		if (element < 0 || element > 255) { return false; }
	}

	// fix
	return true;
}

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

function calc_magic_number(octet_mask) {
	return 256 - octet_mask;
}

function calc_subnet_id(octet_ip, magic_num) {
	return octet_ip - (octet_ip % magic_num);
}

function calc_broadcast(octet_subnet, magic_num) {
	return octet_subnet + magic_num - 1;
}

// Hosts: Subnet + 1 , Broadcast - 1
function calc_hosts_range(subnet_ip, broadcast_ip) {
	let hosts = [subnet_ip, broadcast_ip];
	hosts[0][-1] += 1;
	hosts[1][-1] -= 1;

	return hosts;
}

function calc_networks_total(magic_num) {
	return 256 / magic_num;
}

function calc_hosts_total() {
	return;
}

function output_subnet_info() {
	return;
}

// debug/test
for (let i = 1; i <= 32; i++) {
	console.log("/" + i.toString() + ": " + calc_cidr_mask(i).join("."));
}

document.getElementById("form_ip_subnet").addEventListener('submit', calc_ip_subnet);
