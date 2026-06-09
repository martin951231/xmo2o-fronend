CREATE TABLE `community_approval_flow` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) unsigned NOT NULL DEFAULT '0',
  `village_id` int(11) unsigned NOT NULL DEFAULT '0',
  `flow_name` varchar(100) NOT NULL DEFAULT '',
  `business_type` varchar(50) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_del` tinyint(1) NOT NULL DEFAULT '0',
  `add_time` int(11) unsigned NOT NULL DEFAULT '0',
  `update_time` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_scope_business` (`property_id`,`village_id`,`business_type`,`is_del`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区审批流配置';

CREATE TABLE `community_approval_flow_node` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `flow_id` int(11) unsigned NOT NULL DEFAULT '0',
  `property_id` int(11) unsigned NOT NULL DEFAULT '0',
  `village_id` int(11) unsigned NOT NULL DEFAULT '0',
  `node_name` varchar(100) NOT NULL DEFAULT '',
  `sort` int(11) unsigned NOT NULL DEFAULT '0',
  `approver_wid` int(11) unsigned NOT NULL DEFAULT '0',
  `approver_name` varchar(80) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_del` tinyint(1) NOT NULL DEFAULT '0',
  `add_time` int(11) unsigned NOT NULL DEFAULT '0',
  `update_time` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_flow` (`flow_id`,`is_del`,`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区审批流节点';

CREATE TABLE `community_approval_instance` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `flow_id` int(11) unsigned NOT NULL DEFAULT '0',
  `property_id` int(11) unsigned NOT NULL DEFAULT '0',
  `village_id` int(11) unsigned NOT NULL DEFAULT '0',
  `business_type` varchar(50) NOT NULL DEFAULT '',
  `business_id` int(11) unsigned NOT NULL DEFAULT '0',
  `title` varchar(150) NOT NULL DEFAULT '',
  `apply_wid` int(11) unsigned NOT NULL DEFAULT '0',
  `apply_name` varchar(80) NOT NULL DEFAULT '',
  `apply_remark` varchar(500) NOT NULL DEFAULT '',
  `apply_reason` varchar(500) NOT NULL DEFAULT '' COMMENT '申请原因',
  `change_data` text,
  `current_sort` int(11) unsigned NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0审批中 1通过 2驳回 3撤回',
  `add_time` int(11) unsigned NOT NULL DEFAULT '0',
  `update_time` int(11) unsigned NOT NULL DEFAULT '0',
  `finish_time` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_scope_status` (`property_id`,`village_id`,`status`),
  KEY `idx_apply` (`apply_wid`,`status`),
  KEY `idx_business` (`business_type`,`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区审批实例';

CREATE TABLE `community_approval_instance_node` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `instance_id` int(11) unsigned NOT NULL DEFAULT '0',
  `flow_node_id` int(11) unsigned NOT NULL DEFAULT '0',
  `sort` int(11) unsigned NOT NULL DEFAULT '0',
  `node_name` varchar(100) NOT NULL DEFAULT '',
  `approver_wid` int(11) unsigned NOT NULL DEFAULT '0',
  `approver_name` varchar(80) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0待审批 1通过 2驳回 3撤回',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `approve_time` int(11) unsigned NOT NULL DEFAULT '0',
  `add_time` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_instance` (`instance_id`,`sort`),
  KEY `idx_approver` (`approver_wid`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区审批实例节点快照';

CREATE TABLE `community_approval_record` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `instance_id` int(11) unsigned NOT NULL DEFAULT '0',
  `action` varchar(30) NOT NULL DEFAULT '',
  `operator_wid` int(11) unsigned NOT NULL DEFAULT '0',
  `operator_name` varchar(80) NOT NULL DEFAULT '',
  `remark` varchar(500) NOT NULL DEFAULT '',
  `add_time` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_instance` (`instance_id`,`add_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区审批操作记录';
